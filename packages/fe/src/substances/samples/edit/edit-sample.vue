<script setup>
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import {
	ElInput,
	ElForm,
	ElDatePicker,
	ElButton,
	ElFormItem,
	ElSelect,
	ElInputNumber,
	ElOption
} from 'element-plus';
import { $isFormValid } from '../../../lib/utils/form-validation/is-form-valid';
import { $notify, $notifyUserAboutError } from '../../../lib//utils/feedback/notify-msg';
import { $api } from '../../../lib//api';
import { $confirm } from '../../../lib//utils/feedback/confirm-msg';
import RhIcon from '../../../lib/components/rh-icon.vue';
import { $route, $router } from '../../../lib//router/router';
import { emptySample, formRules } from './constants';
import { checkEditedFields } from '../../constants.js';
import SubstancesUsed from './substances-used.vue';

const props = defineProps({ id: { type: String, default: null } });
const storages = ref([]);
const formEl = useTemplateRef('form-el');
const sample = ref(emptySample);
const rules = ref(formRules);
const isEditing = computed(() => $route.value.name === 'edit-sample');
const isLoading = ref(true);
const isSaving = ref(false);
const originalSample = ref({});
const updatedSampleValues = ref({ category: 'sample' });
watch(
	sample,
	sampleFields => {
		updatedSampleValues.value = checkEditedFields(
			sampleFields,
			originalSample,
			updatedSampleValues
		);
	},
	{ deep: true }
);
async function deleteSample() {
	try {
		await $confirm('Are you sure you want to delete this sample?', 'Delete Sample?', {
			confirmButtonText: 'Delete',
			type: 'warning'
		});
		try {
			const response = await $api.substances.deleteSubstance('sample', props.id);
			$notify({
				title: 'Success',
				message: response.message,
				type: 'success'
			});
			$router.push({ name: 'substances-list' });
		} catch (error) {
			$notifyUserAboutError(error);
		}
	} catch (error) {
		if (!['cancel', 'close'].includes(error)) {
			this.$notifyUserAboutError(error);
		}
	}
}
async function submit() {
	if (!(await $isFormValid(formEl))) return;
	isSaving.value = true;
	try {
		if (sample.value.quantityLeft <= 0) {
			await deleteSampleZero();
		} else {
			const response = await $api.substances.updateSubstance(props.id, updatedSampleValues.value);
			$notify({
				title: response.status.charAt(0).toUpperCase() + response.status.slice(1),
				message: response.message || 'Sample has been updated',
				type: response.status
			});
			$router.push({ name: 'sample-details', params: { id: props.id } });
			setSample(props.id);
			updatedSampleValues.value = { category: 'sample' };
		}
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		isSaving.value = false;
	}
}
const deleteSampleZero = async () => {
	try {
		await $confirm('Quantity reached 0. Do you want to delete this sample?', 'Warning', {
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel',
			type: 'warning'
		});
		await $api.substances.updateSubstance(sample.value.id, updatedSampleValues.value);
		$notify({
			title: 'Success',
			message: 'Sample deletion was requested',
			type: 'success'
		});
		$router.push({ name: 'substances-list' });
	} catch (error) {
		if (!['cancel', 'close'].includes(error)) {
			this.$notifyUserAboutError(error);
		}
	}
};
function toggleEdit() {
	$router.push({ name: 'edit-sample', params: { id: props.id } });
}
function cancelEdit() {
	$router.push({ name: 'sample-details', params: { id: props.id } });
	$notify({
		title: 'Canceled',
		message: 'Sample editing canceled',
		type: 'info'
	});
	formEl.value.resetFields();
	sample.value = originalSample.value;
}
async function setStorages() {
	isLoading.value = true;
	try {
		storages.value = await $api.storages.fetchStorages();
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		isLoading.value = false;
	}
}
async function setSample(id) {
	isLoading.value = true;
	try {
		const res = await $api.substances.fetchSubstance('sample', id);
		sample.value = { ...res, storageId: res.storageLocation.id };
		originalSample.value = {
			...sample.value
		};
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		isLoading.value = false;
	}
}
const componentTableData = computed(() =>
	sample.value.components.map(x => ({
		...x,
		quantityUsed: `${x.quantityUsed} ${x.quantityUnit}`
	}))
);
onMounted(() => {
	setSample(props.id);
	setStorages();
});
watch(
	() => props.id,
	newId => setSample(newId)
);
</script>

<template>
	<div v-loading="isLoading" class="wrapper">
		<div class="editing-header">
			<div class="category-icons">
				<rh-icon name="applications" />{{ `${isEditing ? 'Editing ' : ''}${sample.name}` }}
			</div>
			<el-button v-if="!isEditing" @click="toggleEdit">Edit</el-button>
		</div>
		<el-form ref="form-el" :model="sample" :rules="rules" label-position="top">
			<el-form-item label="Name" prop="name">
				<el-input v-model="sample.name" :disabled="!isEditing" />
			</el-form-item>
			<substances-used :data="componentTableData" />
			<div class="align-horizontal">
				<el-form-item label="Quantity unit" prop="quantityUnit">
					<el-select v-model="sample.quantityUnit" filterable disabled />
				</el-form-item>
				<el-form-item label="Quantity" prop="quantity">
					<el-input-number v-model="sample.quantity" disabled>
						<template #suffix>
							{{ sample.quantityUnit }}
						</template>
					</el-input-number>
				</el-form-item>
				<el-form-item label="Quantity left" prop="quantityLeft">
					<el-input-number
						v-model="sample.quantityLeft"
						placeholder="Enter amount"
						:disabled="!isEditing"
						:min="0"
					>
						<template #suffix>
							{{ sample.quantityUnit }}
						</template>
					</el-input-number>
				</el-form-item>
			</div>
			<el-form-item label="Expiration date" prop="expirationDate">
				<el-date-picker v-model="sample.expirationDate" type="date" disabled />
			</el-form-item>
			<el-form-item label="Storage location" prop="storageId">
				<el-select
					v-model="sample.storageId"
					placeholder="Select storage location"
					:disabled="!isEditing"
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
				<el-input
					v-model="sample.description"
					type="textarea"
					placeholder="Enter description"
					:disabled="!isEditing"
				/>
			</el-form-item>
			<div v-if="isEditing" class="btns-container">
				<el-button type="danger" @click="deleteSample">Delete</el-button>
				<div>
					<el-button @click="cancelEdit">Cancel</el-button>
					<el-button :loading="isSaving" type="primary" @click="submit">Update</el-button>
				</div>
			</div>
		</el-form>
	</div>
</template>
