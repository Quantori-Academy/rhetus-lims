<script setup>
import { ElButton, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus';
import { computed } from 'vue';
import RhIcon from '../../lib/components/rh-icon.vue';
import { $api } from '../../lib/api';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg';
import { $router } from '../../lib/router/router';
import { $confirm } from '../../lib/utils/feedback/confirm-msg';

const props = defineProps({
	order: { type: Object, default: null },
	isEdit: { type: Boolean, default: false }
});
const emit = defineEmits(['set-order', 'cancel-edit', 'set-statuses-history']);
const isPending = computed(() => props.order && props.order.status === `pending`);
const statusBtn = computed(() => actions.value[0] || {});
const dropdownBtn = computed(() => actions.value.slice(1));
const actions = computed(() => {
	const buttons = [];
	if (['pending', 'ordered'].includes(props.order && props.order.status)) {
		buttons.push(
			{
				label: props.order.status === 'pending' ? 'Make Order' : 'Mark as Fulfilled',
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

const cancelEdit = () => {
	emit('cancel-edit');
};
const deleteOrder = async () => {
	try {
		await $confirm('Do you want to delete this order?', 'Warning', {
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel',
			type: 'warning'
		});
		const response = await $api.orders.deleteOrder(props.order.id);
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
		const response = await $api.orders.changeOrderStatus(props.order.id, { action: status });
		$notify({
			title: 'Success',
			message: response.message,
			type: 'success'
		});
		emit('set-order', props.order.id);
		emit('set-statuses-history', props.order.id);
	} catch (error) {
		$notifyUserAboutError(error.message || 'Failed to update order status');
	}
};
const toggleEdit = () => {
	$router.push({ name: 'order-details-edit', params: { id: props.order.id } });
};
const completeOrder = () => {
	$router.push({ name: 'complete-order', params: { id: props.order.id } });
};
</script>

<template>
	<div v-if="props.order.status !== 'fulfilled'" class="btn-container">
		<el-button v-if="props.isEdit" @click="cancelEdit">Cancel</el-button>
		<el-button v-if="!props.isEdit && isPending" @click="toggleEdit"
			><rh-icon name="pencil"
		/></el-button>
		<div v-if="!props.isEdit && actions.length > 0" class="action-button-with-dropdown">
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
	<div v-else class="btn-container">
		<el-button type="primary" @click="completeOrder">Complete order</el-button>
	</div>
</template>

<style scope>
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
