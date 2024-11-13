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
	ElOption,
	ElTable,
	ElTableColumn
} from 'element-plus';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg';
import { $api } from '../../lib/api';
import { $confirm } from '../../lib/utils/feedback/confirm-msg';
import { $route, $router } from '../../lib/router/router';
import { emptySample, formRules } from './constants';
import { checkEditedFields } from '../../substances/constants';
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
			const response = await $api.samples.deleteSample(props.id);
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
				title: 'Success',
				message: response.message || 'Sample has been updated',
				type: 'success'
			});
			$router.push({ name: 'sample-details', params: { id: props.id } });
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

function redirect(row) {
	$router.push({
		name: row.category.toLowerCase() === 'reagent' ? 'reagent-details' : 'sample-details',
		params: { id: row.id }
	});
}

async function setStorages() {
	try {
		const data = await $api.storages.fetchStorages();
		storages.value = data.storages;
	} catch (error) {
		$notifyUserAboutError(error);
	}
}

async function setSample(id) {
	isLoading.value = true;
	try {
		const res = await $api.samples.fetchSample(id);
		sample.value = res;
		originalSample.value = {
			...sample.value,
			storageLocation: { ...sample.value.storageLocation }
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
			<div>{{ `${isEditing ? 'Editing ' : ''}${sample.name}` }}</div>
			<el-button v-if="!isEditing" @click="toggleEdit">Edit</el-button>
		</div>
		<el-form ref="form-el" :model="sample" :rules="rules" label-position="top">
			<el-form-item label="Name" prop="name">
				<el-input v-model="sample.name" :disabled="!isEditing" />
			</el-form-item>
			<el-form-item label="Substances used" prop="components">
				<el-table :data="componentTableData" :border="true" @row-click="redirect">
					<el-table-column prop="name" label="Name" />
					<el-table-column prop="category" label="Category" />
					<el-table-column prop="quantityUsed" label="Quantiy Used" />
				</el-table>
			</el-form-item>
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
			<el-form-item label="Storage location" prop="storageLocation.id">
				<el-select
					v-model="sample.storageLocation.id"
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
			<div v-if="isEditing" class="btn-container">
				<el-button type="danger" @click="deleteSample">Delete</el-button>
				<div>
					<el-button @click="cancelEdit">Cancel</el-button>
					<el-button :loading="isSaving" type="primary" @click="submit">Update</el-button>
				</div>
			</div>
		</el-form>
	</div>
</template>

<style>
.btn-container {
	display: flex;
	justify-content: space-between;
}
</style>
