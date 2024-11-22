<script setup>
import {
	ElForm,
	ElInput,
	ElButton,
	ElFormItem,
	ElSelect,
	ElOption,
	ElDatePicker,
	ElInputNumber
} from 'element-plus';
import { $notifyUserAboutError, $notify } from '../../lib/utils/feedback/notify-msg';
import { $confirm } from '../../lib/utils/feedback/confirm-msg.js/';
import { computed, onMounted, useTemplateRef, ref, watch } from 'vue';
import { $api } from '../../lib/api/index.js';
import { $route, $router } from '../../lib/router/router';
import { formRules, emptyReagent } from './constants.js';
import { checkEditedFields } from '../../substances/constants';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid.js';
import RhIcon from '../../lib/components/rh-icon.vue';
const props = defineProps({
	id: {
		type: String,
		default: null
	}
});
const formEl = useTemplateRef('form-ref');
const reagent = ref(emptyReagent);
const loading = ref(true);
const storages = ref([]);
const isEdit = computed(() => $route.value.name === 'reagent-details-edit');
const isOutOfStock = computed(() => reagent.value.quantityLeft === 0);
const originalReagent = ref({});
const rules = ref(formRules);
const updatedReagentValues = ref({ category: 'reagent' });
onMounted(() => {
	setReagent(props.id);
	setStorages();
});
watch(
	reagent,
	reagentFields => {
		updatedReagentValues.value = checkEditedFields(
			reagentFields,
			originalReagent,
			updatedReagentValues
		);
	},
	{ deep: true }
);

async function setStorages() {
	loading.value = true;
	try {
		const data = await $api.storages.fetchStorages();
		storages.value = data.storages;
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		loading.value = false;
	}
}
const setReagent = async id => {
	loading.value = true;
	try {
		const data = await $api.reagents.fetchReagent(id);
		reagent.value = { ...data, storageId: data.storageLocation.id };
		originalReagent.value = {
			...reagent.value
		};
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
		message: 'Reagent editing canceled',
		type: 'info'
	});
	formEl.value.resetFields();
	reagent.value = originalReagent.value;
};
const handleSubmit = async () => {
	if (!(await $isFormValid(formEl))) return;
	try {
		if (isOutOfStock.value) {
			await deleteReagentZero();
		} else {
			const response = await $api.substances.updateSubstance(
				reagent.value.id,
				updatedReagentValues.value
			);
			$notify({
				title: response.status.charAt(0).toUpperCase() + response.status.slice(1),
				message: response.message || 'Reagent has been updated',
				type: response.status
			});
			$router.push({ name: 'reagent-details', params: { id: reagent.value.id } });
			setReagent(props.id);
			updatedReagentValues.value = { category: 'reagent' };
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
		await $api.substances.updateSubstance(reagent.value.id, updatedReagentValues.value);
		$notify({
			title: 'Success',
			message: 'Reagent deletion was requested',
			type: 'success'
		});
		$router.push({ name: 'substances-list' });
	} catch (error) {
		if (!['cancel', 'close'].includes(error)) {
			this.$notifyUserAboutError(error);
		}
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
		await $router.push({ name: 'substances-list' });
	} catch (error) {
		if (!['cancel', 'close'].includes(error)) {
			this.$notifyUserAboutError(error);
		}
	}
};
</script>

<template>
	<div v-if="reagent" v-loading="loading" class="wrapper">
		<div v-if="reagent" class="editing-header">
			<div class="category-icons">
				<rh-icon name="pod" />{{ `${isEdit ? 'Editing ' : ''}${reagent.name}` }}
			</div>
			<el-button v-if="!isEdit" @click="toggleEdit">{{ 'Edit' }}</el-button>
		</div>
		<el-form
			ref="form-ref"
			v-loading="loading || !reagent"
			label-position="top"
			:model="reagent"
			:rules="rules"
			@submit="handleSubmit"
		>
			<el-form-item label="Name" prop="name">
				<el-input v-model="reagent.name" :disabled="!isEdit" />
			</el-form-item>
			<div class="align-horizontal">
				<el-form-item label="CAS number" prop="casNumber">
					<el-input v-model="reagent.casNumber" :disabled="true" />
				</el-form-item>
				<el-form-item label="Producer" prop="producer">
					<el-input v-model="reagent.producer" :disabled="true" />
				</el-form-item>
			</div>
			<div class="align-horizontal">
				<el-form-item label="Catalog ID" prop="catalogId">
					<el-input v-model="reagent.catalogId" :disabled="true" />
				</el-form-item>
				<el-form-item label="Catalog link" prop="catalogLink">
					<el-input v-model="reagent.catalogLink" :disabled="true" />
				</el-form-item>
			</div>
			<div class="align-horizontal">
				<el-form-item label="Quantity unit" prop="quantityUnit">
					<el-input v-model="reagent.quantityUnit" :disabled="true" />
				</el-form-item>
				<el-form-item label="Quantity" prop="quantity">
					<el-input-number v-model="reagent.quantity" :disabled="true" />
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
			</div>
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
			<el-form-item label="Storage location" prop="storageId">
				<el-select v-model="reagent.storageId" :disabled="!isEdit" filterable>
					<el-option
						v-for="storage of storages"
						:key="storage.id"
						:label="`${storage.room} - ${storage.name}`"
						:value="storage.id"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="Description" prop="description">
				<el-input v-model="reagent.description" type="textarea" :disabled="!isEdit" />
			</el-form-item>
			<div v-if="isEdit" class="btns-container">
				<el-button type="danger" @click="deleteReagent">{{ 'Delete reagent' }}</el-button>
				<div>
					<el-button @click="cancelEdit">Cancel</el-button>
					<el-button type="primary" @click="handleSubmit">{{ 'Save' }}</el-button>
				</div>
			</div>
		</el-form>
	</div>
</template>

<style scoped>
:deep(.el-date-editor) {
	width: 100%;
}
</style>
