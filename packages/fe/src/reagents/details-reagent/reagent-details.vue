<script setup>
import {
	ElForm,
	ElInput,
	ElButton,
	ElFormItem,
	ElSelect,
	ElOption,
	ElDatePicker,
	ElInputNumber,
	ElOptionGroup
} from 'element-plus';
import { $notifyUserAboutError, $notify } from '../../lib/utils/feedback/notify-msg';
import { $confirm } from '../../lib/utils/feedback/confirm-msg.js/';
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
const reagent = ref(null);
const loading = ref(false);
const storages = ref([]);
const storageDisplayValue = ref('');
const isEdit = computed(() => $route.value.name === 'reagent-details-edit');
const isOutOfStock = computed(() => reagent.value.quantityLeft === 0);

onMounted(() => {
	setReagent(props.id);
	setStorages();
});

const rules = ref({
	quantityLeft: [requiredRule('Quantity left')]
});

async function setStorages() {
	try {
		const data = await $api.storages.fetchStorages();
		storages.value = data.storages;
		const foundStorage = storages.value.find(
			storage => storage.id === reagent.value.storageLocationId
		);
		storageDisplayValue.value = foundStorage ? foundStorage.name : 'Select a storage';
	} catch (error) {
		$notifyUserAboutError(error);
	}
}

const setReagent = async id => {
	loading.value = true;
	try {
		reagent.value = await $api.reagents.fetchReagent(id);
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating reagent');
	} finally {
		loading.value = false;
	}
};

const toggleEdit = () => {
	$router.push({ name: 'reagent-details-edit', params: { id: reagent.value.id } });
};

const cancelEdit = () => {
	$router.push({ name: 'reagent-details', params: { id: reagent.value.id } });
	$notify({
		title: 'Canceled',
		message: 'Reagent deletion canceled',
		type: 'info'
	});
	formEl.value.resetFields();
};

const handleSubmit = async () => {
	if (!(await $isFormValid(formEl))) return;
	try {
		if (isOutOfStock.value) {
			await deleteReagentZero();
		} else {
			const updatedReagent = await $api.reagents.updateReagent(reagent.value.id, reagent.value);
			reagent.value = updatedReagent;
			$notify({
				title: 'Success',
				message: 'Reagent has been updated',
				type: 'success'
			});
			$router.push({ name: 'reagent-details', params: { id: reagent.value.id } });
		}
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating reagent');
	}
};
const deleteReagentZero = async () => {
	try {
		await $confirm('Quantity reached 0. Do you want to delete this reagent?', 'Warning', {
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel',
			type: 'warning'
		});
		await $api.reagents.updateReagent(reagent.value.id, reagent.value);
		$notify({
			title: 'Success',
			message: 'Reagent deletion was requested',
			type: 'success'
		});
		await $router.push({ name: 'reagents-list' });
	} catch {
		$notify({
			title: 'Canceled',
			message: 'Reagent deletion was canceled',
			type: 'info'
		});
	}
};

const deleteReagent = async () => {
	try {
		await $confirm('Do you want to delete this reagent?', 'Warning', {
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel',
			type: 'warning'
		});
		const response = await $api.reagents.deleteReagent(props.id);
		$notify({
			title: 'Success',
			message: response.message,
			type: 'success'
		});
		await $router.push({ name: 'reagents-list' });
	} catch {
		$notify({
			title: 'Canceled',
			message: 'Reagent deletion was canceled',
			type: 'info'
		});
	}
};
</script>

<template>
	<div class="reagent-details">
		<el-form
			v-if="reagent"
			ref="form-ref"
			v-loading="loading || !reagent"
			label-position="top"
			:model="reagent"
			:rules="rules"
			@submit="handleSubmit"
		>
			<el-form-item label="Name" prop="name">
				<el-input v-model="reagent.name" :disabled="true" />
			</el-form-item>
			<el-form-item label="Category">
				<el-select v-model="reagent.category" :disabled="true" :placeholder="reagent.category">
					<el-option label="Reagent" value="reagent" />
					<el-option label="Sample" value="sample" />
				</el-select>
			</el-form-item>
			<el-form-item label="Description" prop="description">
				<el-input v-model="reagent.description" :disabled="true" />
			</el-form-item>
			<el-form-item label="CAS number" prop="casNumber">
				<el-input v-model="reagent.casNumber" :disabled="true" />
			</el-form-item>
			<el-form-item label="Producer" prop="producer">
				<el-input v-model="reagent.producer" :disabled="true" />
			</el-form-item>
			<el-form-item label="Catalog ID" prop="catalogId">
				<el-input v-model="reagent.catalogId" :disabled="true" />
			</el-form-item>
			<el-form-item label="Catalog link" prop="catalogLink">
				<el-input v-model="reagent.catalogLink" :disabled="true" />
			</el-form-item>
			<el-form-item label="Storage location" prop="storageLocationId">
				<el-select
					v-model="reagent.storageLocationId"
					:disabled="!isEdit"
					:placeholder="reagent && storageDisplayValue"
				>
					<el-option-group v-for="storage of storages" :key="storage.id" :label="storage.room">
						<el-option :key="storage.id" :label="storage.name" :value="storage.id" />
					</el-option-group>
				</el-select>
			</el-form-item>
			<el-form-item label="Quantity left" prop="quantityLeft">
				<el-input-number
					v-model="reagent.quantityLeft"
					placeholder="Enter amount"
					:disabled="!isEdit"
					:min="0"
				>
				</el-input-number>
			</el-form-item>
			<el-form-item label="Quantity" prop="quantity">
				<el-input v-model="reagent.quantity" :disabled="true" />
			</el-form-item>
			<el-form-item label="Unit" prop="quantityUnit">
				<el-input v-model="reagent.quantityUnit" :disabled="true" />
			</el-form-item>
			<el-form-item label="Price per unit" prop="unitPrice">
				<el-input v-model="reagent.unitPrice" :disabled="true" />
			</el-form-item>
			<el-form-item label="Expiration date" prop="expirationDate">
				<el-date-picker
					v-model="reagent.expirationDate"
					type="date"
					format="YYYY-MM-DD"
					value-format="YYYY-MM-DD"
					disabled
				/>
			</el-form-item>
			<template v-if="isEdit">
				<el-button type="primary" @click="handleSubmit">{{ 'Save' }}</el-button>
				<el-button @click="cancelEdit">Cancel</el-button>
			</template>
			<template v-else>
				<el-button type="primary" @click="toggleEdit">{{ 'Edit reagent' }}</el-button>
				<el-button type="danger" @click="deleteReagent">{{ 'Delete reagent' }}</el-button>
			</template>
		</el-form>
	</div>
</template>

<style scoped>
.reagent-details {
	display: flex;
	flex-direction: column;
	gap: 5rem;
	margin: 20px;
	max-width: 70vw;
	color: black;
}
.reagent-details :deep(.el-input__wrapper),
.reagent-details :deep(.el-select__wrapper) {
	background-color: transparent;
}

.quantity-unit-wrapper {
	display: flex;
	flex-direction: row;
	gap: 10px;
}
@media screen and (max-width: 578px) {
	.el-button {
		margin: 0;
		margin-top: 10px;
	}
}
</style>
