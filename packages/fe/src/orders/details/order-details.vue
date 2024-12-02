/* eslint-disable max-lines */
<script setup>
import { ElForm, ElInput, ElButton, ElFormItem, ElDatePicker, ElTag } from 'element-plus';
import { $notifyUserAboutError, $notify } from '../../lib/utils/feedback/notify-msg';
import { computed, onMounted, useTemplateRef, ref } from 'vue';
import { $api } from '../../lib/api/index.js';
import { $route, $router } from '../../lib/router/router';
import { findUpdatedItems, getButtonType, orderFormRules, orderRef } from './constants.js';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid.js';
import { $confirm } from '../../lib/utils/feedback/confirm-msg.js';
import RhIcon from '../../lib/components/rh-icon.vue';
import TimelineStatuses from '../../timeline/timeline-statuses.vue';
import OrderTable from './details-table/order-table.vue';
import RequestSuggestions from './request-suggestions.vue';
import OrderActions from './order-actions.vue';

const props = defineProps({
	id: {
		type: String,
		default: null
	}
});
const orderForm = useTemplateRef('form-ref');
const rules = ref(orderFormRules);
const order = ref(orderRef);
const originalOrder = ref({});
const linkedRequests = ref([]);
const loading = ref(true);
const isEdit = computed(() => $route.value.name === 'order-details-edit');
const isOrderValid = computed(
	() => order.value.reagents.length > 0 || order.value.reagentRequests.length > 0
);
const statusesHistory = ref(null);
const isReagentAdded = computed(() => {
	return order.value.reagents.length > 0 || order.value.reagentRequests.length > 0;
});
const updatedItems = ref([]);

const getUpdatedFields = async (original, current) => {
	findUpdatedItems(original.reagentRequests, current.reagentRequests, updatedItems.value);
	findUpdatedItems(original.reagents, current.reagents, updatedItems.value);
};
const submitSubstances = async () => {
	await getUpdatedFields({ ...originalOrder.value }, { ...order.value });
	if (updatedItems.value.length === 0) {
		$router.push({ name: 'order-details', params: { id: order.value.id } });
	}
	try {
		const body = {
			orderItems: updatedItems.value
		};
		const response = await $api.orders.updateItemInOrder(order.value.id, body);
		if (response.status === 'success') {
			$router.push({ name: 'order-details', params: { id: order.value.id } });
		}
	} catch (error) {
		$notifyUserAboutError(error);
	}
	updatedItems.value = [];
};

const handleLinkedRequestsUpdate = updatedRequests => {
	linkedRequests.value = updatedRequests;
};

onMounted(() => {
	setOrder(props.id);
});

const setOrder = async id => {
	loading.value = true;
	try {
		const fetchedOrder = await $api.orders.fetchOrder(id);
		order.value = { ...fetchedOrder };
		originalOrder.value = JSON.parse(JSON.stringify(fetchedOrder));
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating order');
	} finally {
		loading.value = false;
	}
};
const cancelEdit = () => {
	$router.push({ name: 'order-details', params: { id: order.value.id } });
	$notify({
		title: 'Canceled',
		message: 'Order editing canceled',
		type: 'info'
	});
	order.value = { ...originalOrder.value };
	orderForm.value.resetFields();
};

const updateOrder = async () => {
	try {
		if (!(await $isFormValid(orderForm))) return;
		const updatedFields = {
			title: order.value.title,
			seller: order.value.seller
		};
		const response = await $api.orders.updateOrder(order.value.id, updatedFields);
		$notify({
			title: 'Success',
			message: response.message,
			type: 'success'
		});
		if (response.status === 'success') {
			await setOrder(props.id);
		}
		$router.push({ name: 'order-details' });
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating order');
	}
};

const setStatusesHistory = async () => {
	loading.value = true;
	try {
		const data = await $api.orders.fetchOrdersHistory(props.id);
		statusesHistory.value = data.histories;
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error getting history');
	} finally {
		loading.value = false;
	}
};
const removeLinkedRequest = async selectedRequest => {
	try {
		const body = { reagentRequests: [selectedRequest.tempId], reagents: [] };
		const response = await $api.orders.removeItemFromOrder(order.value.id, body);
		if (response.status === 'success') {
			await setOrder(props.id);
		}
	} catch (error) {
		$notifyUserAboutError(error);
	}
};
const removeReagent = async selectedReagent => {
	try {
		// ! test id for prod
		const body = { reagentRequests: [], reagents: [selectedReagent.tempId] };
		const response = await $api.orders.removeItemFromOrder(order.value.id, body);
		if (response.status === 'success') {
			await setOrder(props.id);
		}
	} catch (error) {
		$notifyUserAboutError(error);
	}
};

const updateItem = (tempId, type, field, newValue) => {
	let reagentToUpdate;
	if (type === 'reagentRequests') {
		reagentToUpdate = order.value.reagentRequests.find(item => item.tempId === tempId);
	} else if (type === 'reagents') {
		reagentToUpdate = order.value.reagents.find(item => item.tempId === tempId);
	}
	if (reagentToUpdate) {
		reagentToUpdate[field] = newValue;
	} else {
		$notifyUserAboutError(`Item not found`);
	}
};
const addNewReagent = async selected => {
	const newSub = {
		...selected,
		name: selected.reagentName
	};
	try {
		const body = {
			reagentRequests: [],
			reagents: [],
			newReagents: [{ ...newSub }]
		};
		const response = await $api.orders.addItemToOrder(order.value.id, body);
		if (response.status === 'success') {
			setOrder(props.id);
		}
	} catch (error) {
		$notifyUserAboutError(error);
	}
};
const addExistingReagent = async selected => {
	try {
		const body = {
			reagentRequests: [],
			reagents: [{ ...selected }],
			newReagents: []
		};
		const response = await $api.orders.addItemToOrder(order.value.id, body);
		if (response.status === 'success') {
			setOrder(props.id);
		}
	} catch (error) {
		$notifyUserAboutError(error);
	}
};
</script>

<template>
	<div v-loading="loading">
		<div class="wrapper">
			<div class="header">
				<h2>
					{{ `${isEdit ? 'Editing ' : ''}${order.title}` }}
					<el-tag :type="getButtonType(order.status)" round>
						{{ order.status }}
					</el-tag>
				</h2>
				<order-actions
					:order="order"
					:is-edit="isEdit"
					@set-order="setOrder"
					@cancel-edit="cancelEdit"
				/>
			</div>
			<el-form
				ref="form-ref"
				label-position="top"
				:model="order"
				:rules="rules"
				@submit="updateOrder"
			>
				<el-form-item label="Title" prop="title">
					<el-input v-model="order.title" :disabled="!isEdit" />
				</el-form-item>
				<el-form-item label="Seller" prop="seller">
					<el-input v-model="order.seller" :disabled="!isEdit" />
				</el-form-item>
				<el-form-item label="Author" prop="author.username">
					<el-input v-model="order.author.username" :disabled="true" />
				</el-form-item>
				<el-form-item label="Created at" prop="createdAt">
					<el-date-picker v-model="order.createdAt" type="date" format="YYYY-MM-DD" disabled />
				</el-form-item>
				<el-form-item label="Updated at" prop="updatedAt">
					<el-date-picker v-model="order.updatedAt" type="date" format="YYYY-MM-DD" disabled />
				</el-form-item>
				<div v-if="isEdit" class="btn-container">
					<el-button type="primary" :disabled="!isReagentAdded" @click="updateOrder"
						>Save</el-button
					>
				</div>
			</el-form>
		</div>
		<div v-if="order.status !== 'canceled'" class="wrapper">
			<request-suggestions
				:order="order"
				:is-edit="isEdit"
				@set-order="setOrder"
				@update-linked-requests="handleLinkedRequestsUpdate"
			/>
			<order-table
				:order="order"
				:is-edit="isEdit"
				:linked-requests="linkedRequests"
				:is-reagent-added="isReagentAdded"
				@set-order="setOrder"
				@remove-linked-request="removeLinkedRequest"
				@remove-reagent="removeReagent"
				@update-item="updateItem"
				@submit-substances="submitSubstances"
				@add-new-reagent="addNewReagent"
				@add-existing-reagent="addExistingReagent"
			/>
		</div>

		<timeline-statuses
			v-if="!isEdit"
			:statuses-history="statusesHistory"
			@set-statuses-history="setStatusesHistory"
		/>
	</div>
</template>

<style scoped>
.wrapper h2 {
	font-size: 18px;
}
.wrapper .header {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
.btn-container {
	display: flex;
	gap: 1rem;
}
</style>
