<script setup>
import { ref, useTemplateRef } from 'vue';
import {
	ElForm,
	ElFormItem,
	ElInput,
	ElInputNumber,
	ElButton,
	ElSelect,
	ElOption
} from 'element-plus';
import { $router } from '../lib/router/router';
import { $notify, $notifyUserAboutError } from '../lib/utils/feedback/notify-msg';
import { $isFormValid } from '../lib/utils/form-validation/is-form-valid';
import { $api } from '../lib/api';
import { rules } from './constants.js';
import KetcherEditor from '../ketcher-editor/ketcher-editor.vue';
import { quantityUnits } from '../lib/constants/quantity-units.js';
import { __ } from '../lib/locales/index.js';

const formEl = useTemplateRef('form-el');
const form = ref({
	reagentName: '',
	structure: '',
	casNumber: '',
	quantity: 1,
	quantityUnit: '',
	amount: 1,
	userComment: ''
});

const cancel = () => {
	formEl.value.resetFields();
	$router.push({ name: 'requests-list' });
};

const submit = async () => {
	if (!(await $isFormValid(formEl))) return;
	try {
		const response = await $api.requests.addRequest({ ...form.value });
		$notify({ message: response.message, type: 'success' });
		$router.push({ name: 'requests-list' });
	} catch (error) {
		$notifyUserAboutError(error);
	}
};
</script>

<template>
	<div class="wrapper">
		<el-form ref="form-el" :model="form" :rules="rules" label-width="auto" label-position="top">
			<el-form-item :label="__('Reagent name')" prop="reagentName">
				<el-input v-model="form.reagentName" :placeholder="__('Enter reagent name')" />
			</el-form-item>
			<el-form-item :label="__('Structure')" prop="structure">
				<ketcher-editor v-model:smiles="form.structure" :placeholder="__('Enter structure')" />
			</el-form-item>
			<el-form-item :label="__('CAS number')" prop="casNumber">
				<el-input v-model="form.casNumber" :placeholder="__('Indicate CAS number')" />
			</el-form-item>
			<div class="align-horizontal">
				<el-form-item :label="__('Quantity')" prop="quantity">
					<el-input-number v-model="form.quantity" :min="1" :placeholder="__('Enter quantity')" />
				</el-form-item>
				<el-form-item :label="__('Quantity unit')" prop="quantityUnit">
					<el-select v-model="form.quantityUnit" :placeholder="__('Select unit')">
						<el-option v-for="unit of quantityUnits" :key="unit" :label="unit" :value="unit" />
					</el-select>
				</el-form-item>
				<el-form-item :label="__('Amount')" prop="amount">
					<el-input-number v-model="form.amount" :min="1" :placeholder="__('Enter amount')" />
				</el-form-item>
			</div>
			<el-form-item :label="__('Comment')" prop="userComment">
				<el-input v-model="form.userComment" type="textarea" :placeholder="__('Enter comment')" />
			</el-form-item>
			<div class="btn-container">
				<el-button @click="cancel">{{ __('Cancel') }}</el-button>
				<el-button type="primary" @click="submit">{{ __('Create') }}</el-button>
			</div>
		</el-form>
	</div>
</template>

<style scoped>
.el-input-number {
	width: 100%;
}
</style>
