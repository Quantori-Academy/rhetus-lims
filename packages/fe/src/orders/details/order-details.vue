<script setup>
import {
	ElForm,
	ElInput,
	ElButton,
	ElFormItem,
	ElDatePicker,
	ElDropdown,
	ElDropdownMenu,
	ElDropdownItem,
	ElTag
} from 'element-plus';
import { $notifyUserAboutError, $notify } from '../../lib/utils/feedback/notify-msg';
import { computed, onMounted, useTemplateRef, ref } from 'vue';
import { $api } from '../../lib/api/index.js';
import { $route, $router } from '../../lib/router/router';
import { getButtonType, orderFormRules } from './constants.js';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid.js';
import { $confirm } from '../../lib/utils/feedback/confirm-msg.js';
import RhIcon from '../../lib/components/rh-icon.vue';
import TimelineStatuses from '../../timeline/timeline-statuses.vue';
import SubstanceManagement from './substance-management.vue';
import LinkedRequestsManagement from './linked-requests-management.vue';

const props = defineProps({
	id: {
		type: String,
		default: null
	}
});
const orderForm = useTemplateRef('form-ref');
const rules = ref(orderFormRules);
const order = ref(null);
const originalOrder = ref({});
const linkedRequests = ref([]);
const loading = ref(true);
const isEdit = computed(() => $route.value.name === 'order-details-edit');
const isPending = computed(() => order.value.status === `pending`);
const isOrderValid = computed(
	() => order.value.reagents.length > 0 || order.value.reagentRequests.length > 0
);
const actions = computed(() => {
	const buttons = [];
	if (['pending', 'ordered'].includes(order.value.status)) {
		buttons.push(
			{
				label: order.value.status === 'pending' ? 'Make Order' : 'Mark as Fulfilled',
				action: () => changeStatus('next'),
				type: 'primary'
			},
			{
				label: 'Cancel Order',
				action: () => changeStatus('cancel'),
				type: 'danger'
			}
		);
	}
	return buttons;
});
const statusesHistory = ref(null);
const statusBtn = computed(() => actions.value[0] || {});
const dropdownBtn = computed(() => actions.value.slice(1));

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
		if (!originalOrder.value.id) {
			originalOrder.value = { ...fetchedOrder };
		}
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating order');
	} finally {
		loading.value = false;
	}
};

const deleteOrder = async () => {
	try {
		await $confirm('Do you want to delete this order?', 'Warning', {
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel',
			type: 'warning'
		});
		const response = await $api.orders.deleteOrder(order.value.id);
		$notify({
			title: 'Success',
			message: response.message,
			type: 'success'
		});
		await $router.push({ name: 'orders-list' });
	} catch (error) {
		if (!['cancel', 'close'].includes(error)) {
			$notifyUserAboutError(error);
		}
	}
};
const changeStatus = async status => {
	try {
		const response = await $api.orders.changeOrderStatus(order.value.id, { action: status });
		$notify({
			title: 'Success',
			message: response.message,
			type: 'success'
		});
		await setOrder(order.value.id);
		await setStatusesHistory();
	} catch (error) {
		$notifyUserAboutError(error.message || 'Failed to update order status');
	}
};
const toggleEdit = () => {
	$router.push({ name: 'order-details-edit', params: { id: order.value.id } });
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
			await setOrder(order.value.id);
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
</script>

<template>
	<div v-if="order" v-loading="loading">
		<div class="wrapper">
			<div class="header">
				<h2>
					{{ `${isEdit ? 'Editing ' : ''}${order.title}` }}
					<el-tag :type="getButtonType(order.status)" round>
						{{ order.status }}
					</el-tag>
				</h2>
				<div v-if="order.status !== 'fulfilled'" class="btn-container">
					<el-button v-if="isEdit" @click="cancelEdit">Cancel</el-button>
					<el-button v-if="!isEdit && isPending" @click="toggleEdit"
						><rh-icon name="pencil"
					/></el-button>
					<div v-if="!isEdit && actions.length > 0" class="action-button-with-dropdown">
						<el-button :type="statusBtn.type" class="status-btn" @click="statusBtn.action">
							{{ statusBtn.label }}
						</el-button>
						<el-dropdown trigger="click" placement="bottom-end">
							<el-button :type="statusBtn.type" class="dropdown-btn">
								<rh-icon color="white" name="arrow-down" />
							</el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item v-for="btn of dropdownBtn" :key="btn.label" @click="btn.action">
										{{ btn.label }}
									</el-dropdown-item>
									<el-dropdown-item v-if="isPending" @click="deleteOrder">Delete</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</div>
				</div>
			</div>
			<el-form
				ref="form-ref"
				label-position="top"
				:model="order"
				:rules="rules"
				@submit="updateOrder"
			>
				<el-form-item label="Title" prop="title">
					<el-input v-model="order.title" :disabled="!isEdit || order.status !== `pending`" />
				</el-form-item>
				<el-form-item label="Seller" prop="seller">
					<el-input v-model="order.seller" :disabled="!isEdit || order.status !== `pending`" />
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
					<el-button type="primary" :disabled="!isOrderValid" @click="updateOrder">Save</el-button>
				</div>
			</el-form>
		</div>
		<div v-if="order.status !== 'canceled'" class="wrapper">
			<linked-requests-management
				:order="order"
				:is-edit="isEdit"
				:set-order="setOrder"
				@update-linked-requests="handleLinkedRequestsUpdate"
			/>
			<substance-management
				:order="order"
				:requests="order.requests"
				:is-edit="isEdit"
				:set-order="setOrder"
				:update-order="updateOrder"
				:linked-requests="linkedRequests"
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
.status-btn {
	padding-right: 5px;
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
}
.dropdown-btn {
	padding-left: 5px;
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
}
</style>
