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
import { getButtonType, requiredRule } from './constants.js';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid.js';
import { $confirm } from '../../lib/utils/feedback/confirm-msg.js';
import rhIcon from '../../lib/components/rh-icon.vue';
import TimelineStatuses from '../../timeline/timeline-statuses.vue';

const props = defineProps({
	id: {
		type: String,
		default: null
	}
});
const formEl = useTemplateRef('form-ref');
import RequestsToOrder from './requests-to-order.vue';
const order = ref(null);
const loading = ref(true);
const rules = ref({
	seller: [requiredRule('Seller')],
	title: [requiredRule('Title')]
});
const isEdit = computed(() => $route.value.name === 'order-details-edit');
const actionButtons = computed(() => {
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

onMounted(() => {
	setOrder(props.id);
});

const setOrder = async id => {
	loading.value = true;
	try {
		order.value = await $api.orders.fetchOrder(id);
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
		const response = await $api.orders.deleteOrder(props.id);
		$notify({
			title: 'Success',
			message: response.message,
			type: 'success'
		});
		await $router.push({ name: 'orders-list' });
	} catch (error) {
		if (!['cancel', 'close'].includes(error)) {
			this.$notifyUserAboutError(error);
		}
	}
};
const changeStatus = async status => {
	try {
		await $api.orders.changeOrderStatus(order.value.id, { action: status });
		$notify({
			title: 'Success',
			message: `Order status updated`,
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
	formEl.value.resetFields();
};

const updateOrder = async () => {
	try {
		if (!(await $isFormValid(formEl))) return;
		const response = await $api.orders.updateOrder(order.value.id, order.value);
		$notify({
			title: 'Success',
			message: response.message,
			type: 'success'
		});
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
	<div v-if="order" v-loading="loading" class="wrapper">
		<div v-if="order" class="editing-header">
			<h2>
				{{ order.title }}
				<el-tag :type="getButtonType(order.status)" round>
					{{ order.status }}
				</el-tag>
			</h2>
			<div class="btn-container">
				<el-button v-if="!isEdit && order.status === `pending`" @click="toggleEdit"
					><rh-icon name="pencil"
				/></el-button>
				<el-dropdown>
					<el-button>More Actions<rh-icon name="arrow-down" /></el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item
								v-for="button of actionButtons"
								:key="button.label"
								@click="button.action"
							>
								{{ button.label }}
							</el-dropdown-item>
							<el-dropdown-item @click="deleteOrder">Delete</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</div>
		<div>
			<el-button v-if="!isEdit && order.status === `pending`" @click="toggleEdit">Edit</el-button>
		</div>

		<div></div>

		<el-form
			ref="form-ref"
			v-loading="loading || !order"
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
			<requests-to-order :order="order" />
			<el-form-item label="Created at" prop="createdAt">
				<el-date-picker v-model="order.createdAt" type="date" format="YYYY-MM-DD" disabled />
			</el-form-item>
			<el-form-item label="Updated at" prop="updatedAt">
				<el-date-picker v-model="order.updatedAt" type="date" format="YYYY-MM-DD" disabled />
			</el-form-item>
			<div v-if="isEdit" class="btn-container">
				<el-button @click="cancelEdit">Cancel</el-button>
				<el-button type="primary" @click="updateOrder">Save</el-button>
			</div>
		</el-form>
		<timeline-statuses
			v-if="!isEdit"
			:statuses-history="statusesHistory"
			@set-statuses-history="setStatusesHistory"
		/>
	</div>
</template>

<style scoped>
.el-input-number {
	width: 100%;
}
.editing-header h2 {
	font-size: 18px;
}
:deep(.el-date-editor) {
	width: 100%;
}
.btn-container {
	display: flex;
	gap: 1rem;
}
</style>
