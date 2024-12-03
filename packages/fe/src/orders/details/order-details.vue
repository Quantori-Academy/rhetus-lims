<script setup>
import { ElForm, ElInput, ElFormItem, ElDatePicker, ElTag } from 'element-plus';
import { $notifyUserAboutError, $notify } from '../../lib/utils/feedback/notify-msg';
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import { $api } from '../../lib/api/index.js';
import { $route, $router } from '../../lib/router/router';
import {
	findUpdatedItems,
	getButtonType,
	itemsToRemoveRef,
	orderFormRules,
	orderRef,
	updatedItemsRef,
	validateSubstances
} from './constants.js';
import TimelineStatuses from '../../timeline/timeline-statuses.vue';
import OrderTable from './details-table/order-table.vue';
import RequestSuggestions from './request-suggestions.vue';
import OrderActions from './order-actions.vue';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid.js';
import { __ } from '../../lib/locales/index.js';

const props = defineProps({
	id: {
		type: String,
		default: null
	}
});
const rules = ref(orderFormRules);
const order = ref(orderRef);
const formRef = useTemplateRef('form-ref');
const updatedItems = ref(updatedItemsRef);
const itemsToRemove = ref(itemsToRemoveRef);
const originalOrder = ref({});
const linkedRequests = ref([]);
const suggestedRequests = ref([]);
const loading = ref(true);
const apiCalls = ref([]);
const localrefs = ref({});
const isEdit = computed(() => $route.value.name === 'order-details-edit');
const isOrderValid = computed(
	() => order.value.reagents.length > 0 || order.value.reagentRequests.length > 0
);
const statusesHistory = ref(null);
const isReagentAdded = computed(() => {
	return order.value.reagents.length > 0 || order.value.reagentRequests.length > 0;
});

onMounted(() => {
	fetchRequests();
	setOrder(props.id);
});
const getUpdatedFields = async (original, current) => {
	findUpdatedItems(
		'requests',
		original.reagentRequests,
		current.reagentRequests,
		updatedItems.value
	);
	findUpdatedItems('reagents', original.reagents, current.reagents, updatedItems.value);
};

const updateOrderItems = () => {
	if (updatedItems.value.updates.length > 0) {
		const body = { orderItems: updatedItems.value.updates };
		apiCalls.value.push($api.orders.updateItemInOrder(order.value.id, body));
	}
};

const updateNewItems = () => {
	if (
		updatedItems.value.reagents.length > 0 ||
		updatedItems.value.reagentRequests.length > 0 ||
		updatedItems.value.newReagents.length > 0
	) {
		const body = {
			reagentRequests: updatedItems.value.reagentRequests,
			reagents: updatedItems.value.reagents,
			newReagents: updatedItems.value.newReagents
		};
		apiCalls.value.push($api.orders.addItemToOrder(order.value.id, body));
	}
};

const updateOrderIfo = () => {
	const updatedFields = {
		title: order.value.title,
		seller: order.value.seller
	};
	if (updatedFields.title || updatedFields.seller) {
		apiCalls.value.push($api.orders.updateOrder(order.value.id, updatedFields));
	}
};

const submitSubstances = async () => {
	if (!(await validateSubstances(localrefs.value)) || !(await $isFormValid(formRef))) return;
	await getUpdatedFields({ ...originalOrder.value }, { ...order.value });
	updateOrderItems();
	updateNewItems();
	updateOrderIfo();
	removeSubstances();
	if (apiCalls.value.length === 0) {
		$router.push({ name: 'order-details', params: { id: order.value.id } });
		return;
	}
	try {
		const responses = await Promise.all(apiCalls.value);
		const success = responses.every(response => response.status === 'success');
		if (success) {
			await setOrder(order.value.id);
			$router.push({ name: 'order-details', params: { id: order.value.id } });
		}
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		resetDataChanges();
	}
};
const resetDataChanges = () => {
	updatedItems.value = {
		reagents: [],
		reagentRequests: [],
		updates: [],
		newReagents: []
	};
	itemsToRemove.value = {
		reagents: [],
		reagentRequests: []
	};
	order.value.newReagents = [];
	apiCalls.value = [];
};
const setOrder = async id => {
	loading.value = true;
	try {
		const fetchedOrder = await $api.orders.fetchOrder(id);
		order.value = { ...fetchedOrder, newReagents: [] };
		originalOrder.value = JSON.parse(JSON.stringify(fetchedOrder));
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating order');
	} finally {
		loading.value = false;
	}
};
const cancelEdit = async () => {
	order.value = {
		...JSON.parse(JSON.stringify(originalOrder.value)),
		newReagents: []
	};
	$router.push({ name: 'order-details', params: { id: order.value.id } });
	$notify({
		title: 'Canceled',
		message: 'Order editing canceled',
		type: 'info'
	});
};

const fetchRequests = async () => {
	try {
		const data = await $api.requests.fetchRequests();
		suggestedRequests.value = {
			...data,
			requests: data.requests.filter(request => request.status === 'pending')
		};
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error retrieving request');
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
watch(
	() => order.value.reagentRequests,
	newReagentRequests => {
		linkedRequests.value = [...newReagentRequests];
		fetchRequests();
	},
	{ deep: true, immediate: true }
);
const removeSubstances = () => {
	if (itemsToRemove.value.reagents.length > 0 || itemsToRemove.value.reagentRequests.length > 0) {
		const body = {
			reagentRequests: [...itemsToRemove.value.reagentRequests],
			reagents: [...itemsToRemove.value.reagents]
		};
		apiCalls.value.push($api.orders.removeItemFromOrder(order.value.id, body));
	}
};
const removeLinkedRequest = selected => {
	order.value.reagentRequests = order.value.reagentRequests.filter(
		request => request.tempId !== selected.tempId
	);
	itemsToRemove.value.reagentRequests.push(selected.tempId);
};

const removeReagent = selected => {
	if (selected.type === 'newReagents') {
		order.value.newReagents = order.value.newReagents.filter(
			reagent => reagent.tempId !== selected.tempId
		);
		updatedItems.value.newReagents = updatedItems.value.newReagents.filter(
			reagent => reagent.tempId !== selected.tempId
		);
	} else {
		order.value.reagents = order.value.reagents.filter(item => item.tempId !== selected.tempId);
		itemsToRemove.value.reagents.push(selected.tempId);
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
const linkRequest = async selected => {
	order.value.reagentRequests.push({ ...selected, tempId: selected.id });
};
const addExistingReagent = async selected => {
	order.value.reagents.push({ ...selected, tempId: selected.id });
};
const addNewReagent = async selected => {
	updatedItems.value.newReagents.push({ ...selected });
	order.value.newReagents.push({ ...selected });
};

const handleSubstanceRefs = refs => {
	localrefs.value = refs;
};
</script>

<template>
	<div v-loading="loading">
		<div class="wrapper">
			<div class="header">
				<h2>
					{{ `${isEdit ? __('Editing ') : ''}${order.title}` }}
					<el-tag :type="getButtonType(order.status)" round>
						{{ order.status }}
					</el-tag>
				</h2>
				<order-actions
					:order="order"
					:is-edit="isEdit"
					@set-order="setOrder"
					@cancel-edit="cancelEdit"
					@set-statuses-history="setStatusesHistory"
				/>
			</div>
			<el-form ref="form-ref" label-position="top" :model="order" :rules="rules">
				<el-form-item :label="__('Title')" prop="title">
					<el-input v-model="order.title" :disabled="!isEdit" />
				</el-form-item>
				<el-form-item :label="__('Seller')" prop="seller">
					<el-input v-model="order.seller" :disabled="!isEdit" />
				</el-form-item>
				<el-form-item :label="__('Author')" prop="author.username">
					<el-input v-model="order.author.username" :disabled="true" />
				</el-form-item>
				<el-form-item :label="__('Created at')" prop="createdAt">
					<el-date-picker v-model="order.createdAt" type="date" format="YYYY-MM-DD" disabled />
				</el-form-item>
				<el-form-item :label="__('Updated at')" prop="updatedAt">
					<el-date-picker v-model="order.updatedAt" type="date" format="YYYY-MM-DD" disabled />
				</el-form-item>
			</el-form>
		</div>
		<div v-if="order.status !== 'canceled'" class="wrapper">
			<request-suggestions
				:order="order"
				:is-edit="isEdit"
				:suggested-requests="suggestedRequests"
				:linked-requests="linkedRequests"
				@set-order="setOrder"
				@link-request="linkRequest"
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
				@substance-refs="handleSubstanceRefs"
			/>
		</div>
		<div class="wrapper">
			<timeline-statuses
				v-if="!isEdit"
				:statuses-history="statusesHistory"
				@set-statuses-history="setStatusesHistory"
			/>
		</div>
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
