<script setup>
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import { ElInput, ElForm, ElButton, ElFormItem } from 'element-plus';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid.js';
import { $route, $router } from '../../lib/router/router.js';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $api } from '../../lib/api/index.js';
import { formRef, formRules } from './constants.js';
import SubstanceManagement from './substance-management.vue';
import RequestsManagement from './requests-management.vue';

const formEl = useTemplateRef('form-el');
const isSaving = ref(false);
const loading = ref(false);
const form = ref(formRef);
const rules = ref(formRules);
const isRequest = computed(() => $route.value.name === 'new-order-request');

onMounted(() => {
	const targetId = $route.value.query.id;
	if (targetId) {
		fetchSubstances(targetId, form, loading);
	}
});

const fetchSubstances = async (id, form, loading) => {
	loading.value = true;
	try {
		const reagentData = await $api.reagents.fetchReagent(id);
		const newReagent = {
			reagentName: reagentData.name,
			quantityUnit: reagentData.quantityUnit,
			quantity: reagentData.quantity,
			amount: reagentData.amount || 1
		};
		form.value.reagents = [...form.value.reagents, newReagent];
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error fetching reagent');
	} finally {
		loading.value = false;
	}
};

async function submit() {
	if (!(await $isFormValid(formEl))) return;
	isSaving.value = true;
	try {
		const response = await $api.orders.addOrder({ ...form.value });
		$notify({ message: response.message, type: 'success' });
		$router.push({ name: 'orders-list' });
	} catch (error) {
		$notifyUserAboutError(error.statusText);
	} finally {
		isSaving.value = false;
	}
}
function cancel() {
	formEl.value.resetFields();
	if (isRequest.value) {
		$router.push({ name: 'orders-list' });
	} else {
		$router.push({ name: 'substances-list' });
	}
}
</script>

<template>
	<div class="wrapper">
		<el-form ref="form-el" :model="form" :rules="rules" label-width="auto" label-position="top">
			<el-form-item label="Title" prop="title">
				<el-input v-model="form.title" placeholder="Enter title" />
			</el-form-item>
			<el-form-item label="Seller" prop="seller">
				<el-input v-model="form.seller" placeholder="Enter seller name" />
			</el-form-item>
			<requests-management :form="form" :is-request="isRequest" />
			<substance-management :form="form" :is-request="isRequest" />
		</el-form>
		<div class="btn-container">
			<el-button @click="cancel">Cancel</el-button>
			<el-button :loading="isSaving" type="primary" @click="submit">Create</el-button>
		</div>
	</div>
</template>

<style>
.requests-table,
.btn-container {
	margin-top: 20px;
}
.el-form,
.add-btn {
	width: 100%;
}

.orders-container,
.requests,
.linked-requests-container {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.el-input-group__append,
.linked-requests-container,
.el-form-item__content {
	gap: 10px;
}
</style>
