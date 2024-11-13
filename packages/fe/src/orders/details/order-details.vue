<script setup>
import {
	ElForm,
	ElInput,
	ElButton,
	ElFormItem,
	ElDatePicker,
	ElTable,
	ElTableColumn
} from 'element-plus';
import { $notifyUserAboutError, $notify } from '../../lib/utils/feedback/notify-msg';
import { computed, onMounted, useTemplateRef, ref } from 'vue';
import { $api } from '../../lib/api/index.js';
import { $route, $router } from '../../lib/router/router';
import { requiredRule } from './constants.js';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid.js';
const props = defineProps({
	id: {
		type: String,
		default: null
	}
});
const formEl = useTemplateRef('form-ref');
const order = ref(null);
const loading = ref(true);
const rules = ref({
	seller: [requiredRule('Seller')],
	title: [requiredRule('Title')]
});
const isEdit = computed(() => $route.value.name === 'order-details-edit');

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
const handleSubmit = async () => {
	if (!(await $isFormValid(formEl))) return;
	try {
		const updatedOrder = await $api.orders.updateOrder(order.value.id, order.value);
		order.value = updatedOrder;
		$notify({
			title: 'Success',
			message: 'Order has been updated',
			type: 'success'
		});
		$router.push({ name: 'order-details', params: { id: order.value.id } });
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating order');
	}
};
</script>

<template>
	<div v-if="order" v-loading="loading" class="wrapper">
		<div v-if="order" class="editing-header">
			<h2>{{ `${isEdit ? 'Editing ' : ''}${order.title}` }}</h2>
			<div>
				<el-button v-if="!isEdit && order.status === `pending`" @click="toggleEdit">Edit</el-button>
				<el-button>Make Order</el-button>
			</div>
		</div>
		<div></div>
		<el-form
			ref="form-ref"
			v-loading="loading || !order"
			label-position="top"
			:model="order"
			:rules="rules"
			@submit="handleSubmit"
		>
			<el-form-item label="Title" prop="title">
				<el-input v-model="order.title" :disabled="!isEdit || order.status !== `pending`" />
			</el-form-item>
			<el-form-item label="Seller" prop="seller">
				<el-input v-model="order.seller" :disabled="!isEdit || order.status !== `pending`" />
			</el-form-item>
			<!-- <el-form-item label="Author" prop="author.username">
					<el-input v-model="order.author.username" :disabled="true" />
				</el-form-item> -->

			<el-form-item label="Requests to order" prop="reagentRequests">
				<el-table :data="order.reagentRequests">
					<el-table-column prop="reagentName" label="Name" />
					<el-table-column prop="quantityUnit" label="Quantity Unit" />
					<el-table-column prop="quantity" label="Quantity" />
					<el-table-column prop="amount" label="Amount" />
				</el-table>
			</el-form-item>
			<el-form-item label="Created at" prop="createdAt">
				<el-date-picker
					v-model="order.createdAt"
					type="date"
					format="YYYY-MM-DD"
					value-format="YYYY-MM-DD"
					disabled
				/>
			</el-form-item>
			<el-form-item label="Updated at" prop="updatedAt">
				<el-date-picker
					v-model="order.updatedAt"
					type="date"
					format="YYYY-MM-DD"
					value-format="YYYY-MM-DD"
					disabled
				/>
			</el-form-item>
			<el-form-item label="Status" prop="status">
				<el-input v-model="order.status" disabled />
			</el-form-item>
			<div v-if="isEdit" class="btn-container">
				<el-button @click="cancelEdit">Cancel</el-button>
				<el-button type="primary" @click="handleSubmit">Save</el-button>
			</div>
		</el-form>
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
