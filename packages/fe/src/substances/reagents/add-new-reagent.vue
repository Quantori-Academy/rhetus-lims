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
import RhIcon from '../../lib/components/rh-icon.vue';
import KetcherEditor from '../../ketcher-editor/ketcher-editor.vue';
import { __ } from '../../lib/locales/index.js';
import { newReagentRules } from './constants.js';

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
	storageId: '',
	structure: '',
	description: ''
});

const rules = ref(newReagentRules);

onMounted(() => {
	setStorages();
});

async function submit() {
	if (!(await $isFormValid(formEl))) return;
	isSaving.value = true;
	try {
		const response = await $api.substances.addSubstance({
			...form.value,
			quantityLeft: form.value.quantity,
			category: 'reagent'
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
		storages.value = await $api.storages.fetchStorages({ limit: 999 });
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
			<el-form-item :label="__('Name')" prop="name">
				<el-input v-model="form.name" placeholder="Enter reagent name" />
			</el-form-item>
			<div class="align-horizontal">
				<el-form-item :label="__('CAS number')" prop="casNumber">
					<el-input v-model="form.casNumber" :placeholder="__('Indicate CAS number')" />
				</el-form-item>
				<el-form-item :label="__('Producer')" prop="producer">
					<el-input v-model="form.producer" :placeholder="__('Add producer')" />
				</el-form-item>
			</div>
			<div class="align-horizontal">
				<el-form-item :label="__('Catalog ID')" prop="catalogId">
					<el-input v-model="form.catalogId" :placeholder="__('Add catalog id')" />
				</el-form-item>
				<el-form-item :label="__('Catalog link')" prop="catalogLink">
					<el-input v-model="form.catalogLink" :placeholder="__('Add catalog link')" />
				</el-form-item>
			</div>
			<div class="align-horizontal">
				<el-form-item :label="__('Quantity unit')" prop="quantityUnit">
					<el-select v-model="form.quantityUnit" filterable :placeholder="__('Select a unit')">
						<el-option v-for="unit of quantityUnits" :key="unit" :label="unit" :value="unit" />
					</el-select>
				</el-form-item>
				<el-form-item :label="__('Quantity')" prop="quantity">
					<el-input-number v-model="form.quantity" :placeholder="__('Enter amount')" :min="1" />
				</el-form-item>
			</div>
			<el-form-item :label="__('Price per unit')" prop="unitPrice">
				<el-input v-model="form.unitPrice" :placeholder="__('Price per unit')" />
			</el-form-item>
			<el-form-item :label="__('Expiration date')" prop="expirationDate">
				<el-date-picker
					v-model="form.expirationDate"
					:placeholder="__('Indicate expiration date')"
					type="date"
					format="YYYY-MM-DD"
				/>
			</el-form-item>
			<el-form-item :label="__('Storage location')" prop="storageId">
				<el-select
					v-model="form.storageId"
					:placeholder="__('Select storage location')"
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
			<el-form-item :label="__('Structure')" prop="structure">
				<ketcher-editor v-model:smiles="form.structure" :placeholder="__('Enter structure')" />
			</el-form-item>
			<el-form-item :label="__('Description')" prop="description">
				<el-input
					v-model="form.description"
					type="textarea"
					:placeholder="__('Enter description')"
				/>
			</el-form-item>
			<div class="btn-container">
				<el-button @click="cancel">{{ __('Cancel') }}</el-button>
				<el-button :loading="isSaving" type="primary" @click="submit">
					<rh-icon color="#7DCDEA" name="pod" class="icon" />{{ __('Create') }}
				</el-button>
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
