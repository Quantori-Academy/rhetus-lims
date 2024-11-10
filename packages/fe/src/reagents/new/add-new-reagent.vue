<script setup>
import { onMounted, ref, useTemplateRef } from 'vue';
import {
	ElInput,
	ElForm,
	ElDatePicker,
	ElButton,
	ElFormItem,
	ElInputNumber,
	ElSelect,
	ElOption
} from 'element-plus';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid';
import { $router } from '../../lib/router/router';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg';
import { $api } from '../../lib/api';
import { quantityUnits } from '../../lib/constants/quantity-units.js';
import { requiredRule } from './constants.js';

const formEl = useTemplateRef('form-el');
const isSaving = ref(false);
const isLoading = ref(true);
const storages = ref([]);
const form = ref({
	name: '',
	casNumber: '',
	producer: '',
	catalogId: '',
	catalogLink: '',
	quantityUnit: '',
	quantity: 1,
	unitPrice: 0,
	expirationDate: '',
	storageLocationId: '',
	description: ''
});

const rules = ref({
	name: [requiredRule('Name')],
	quantityUnit: [requiredRule('Quantity unit')],
	quantity: [
		requiredRule('Quantity'),
		{ type: 'number', min: 1, message: 'Quantity cannot be zero', trigger: ['blur', 'change'] }
	],
	storageLocationId: [requiredRule('Storage location')]
});

onMounted(() => {
	setStorages();
});

async function submit() {
	if (!(await $isFormValid(formEl))) return;
	isSaving.value = true;
	try {
		const response = await $api.reagents.addReagent({
			...form.value,
			quantityLeft: form.value.quantity
		});
		$notify({ message: response.message, type: 'success' });
		$router.push({ name: 'substances-list' });
	} catch (error) {
		$notifyUserAboutError(error.statusText);
	} finally {
		isSaving.value = false;
	}
}

function cancel() {
	formEl.value.resetFields();
	$router.push({ name: 'substances-list' });
}
async function setStorages() {
	isLoading.value = true;
	try {
		const data = await $api.storages.fetchStorages();
		storages.value = data.storages;
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		isLoading.value = false;
	}
}
</script>

<template>
	<div class="wrapper">
		<el-form ref="form-el" :model="form" :rules="rules" label-width="auto" label-position="top">
			<el-form-item label="Name" prop="name">
				<el-input v-model="form.name" placeholder="Enter reagent name" />
			</el-form-item>
			<div class="align-horizontal">
				<el-form-item label="CAS number" prop="casNumber">
					<el-input v-model="form.casNumber" placeholder="Indicate CAS number" />
				</el-form-item>
				<el-form-item label="Producer" prop="producer">
					<el-input v-model="form.producer" placeholder="Add producer" />
				</el-form-item>
			</div>
			<div class="align-horizontal">
				<el-form-item label="Catalog ID" prop="catalogId">
					<el-input v-model="form.catalogId" placeholder="Add catalog id" />
				</el-form-item>
				<el-form-item label="Catalog link" prop="catalogLink">
					<el-input v-model="form.catalogLink" placeholder="Add catalog link" />
				</el-form-item>
			</div>
			<div class="align-horizontal">
				<el-form-item label="Quantity unit" prop="quantityUnit">
					<el-select v-model="form.quantityUnit" filterable placeholder="Select a unit">
						<el-option v-for="unit of quantityUnits" :key="unit" :label="unit" :value="unit" />
					</el-select>
				</el-form-item>
				<el-form-item label="Quantity" prop="quantity">
					<el-input-number v-model="form.quantity" placeholder="Enter amount" :min="1" />
				</el-form-item>
			</div>
			<el-form-item label="Price per unit" prop="unitPrice">
				<el-input v-model="form.unitPrice" placeholder="Price per unit" />
			</el-form-item>
			<el-form-item label="Expiration date" prop="expirationDate">
				<el-date-picker
					v-model="form.expirationDate"
					placeholder="Indicate expiration date"
					type="date"
					format="YYYY-MM-DD"
				/>
			</el-form-item>
			<el-form-item label="Storage location" prop="storageLocationId">
				<el-select
					v-model="form.storageLocationId"
					placeholder="Select storage location"
					:loading="isLoading"
					filterable
				>
					<el-option
						v-for="storage of storages"
						:key="storage.id"
						:label="`${storage.room} - ${storage.name}`"
						:value="storage.id"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="Description" prop="description">
				<el-input v-model="form.description" type="textarea" placeholder="Enter description" />
			</el-form-item>
			<div class="btn-container">
				<el-button @click="cancel">Cancel</el-button>
				<el-button :loading="isSaving" type="primary" @click="submit">Create</el-button>
			</div>
		</el-form>
	</div>
</template>

<style>
.el-input-number {
	width: 100%;
}
.el-date-editor.el-input,
.el-date-editor.el-input__wrapper {
	width: 100%;
}
</style>
