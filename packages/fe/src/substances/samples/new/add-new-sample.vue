<script setup>
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import {
	ElInput,
	ElForm,
	ElDatePicker,
	ElButton,
	ElFormItem,
	ElSelect,
	ElOption,
	ElInputNumber
} from 'element-plus';
import { quantityUnits } from '../../../lib/constants/quantity-units';
import { $isFormValid } from '../../../lib/utils/form-validation/is-form-valid';
import { $router } from '../../../lib/router/router';
import { $notify, $notifyUserAboutError } from '../../../lib/utils/feedback/notify-msg';
import { $api } from '../../../lib/api';
import { formRef, formRules } from './constants';
import RhIcon from '../../../lib/components/rh-icon.vue';
import KetcherEditor from '../../../ketcher-editor/ketcher-editor.vue';
import { __ } from '../../../lib/locales';
import SuggestedComponents from './suggested-components.vue';
import SelectedComponents from './selected-components.vue';
import { $confirm } from '../../../lib/utils/feedback/confirm-msg';

const storages = ref([]);
const formEl = useTemplateRef('form-el');
const form = ref(formRef);
const rules = ref(formRules);
const isSaving = ref(false);
const resetSelects = ref(false);
const selectedOption = ref(null);
const selectedQuantity = ref(0);
const allSubstances = ref([]);
const componentOptions = ref([]);
const futureQuantity = computed(() => {
	const currentQuantity = selectedOption.value?.quantityLeft || 0;
	const quantityUsed = selectedQuantity.value || 0;
	return Math.max(0, currentQuantity - quantityUsed);
});

onMounted(() => {
	setComponents();
	setStorages();
	resetForms();
});
async function submit() {
	if (!(await $isFormValid(formEl))) return;
	isSaving.value = true;
	try {
		if (selectedOption.value) {
			await $confirm(
				__(`You have selected a component but did not add it, are you sure you want to proceed?`),
				'Warning',
				{
					confirmButtonText: 'OK',
					type: 'warning'
				}
			);
		}
		const response = await $api.substances.addSubstance({
			...form.value,
			quantityLeft: form.value.quantity,
			category: 'sample',
			components: form.value.components.map(x => ({
				id: x.id,
				category: x.category,
				quantityUsed: x.quantityUsed
			}))
		});
		$notify({ message: response.message, type: 'success' });
		resetForms();
		$router.push({ name: 'substances-list' });
	} catch (error) {
		if (!['cancel', 'close'].includes(error)) {
			$notifyUserAboutError(error);
		}
	} finally {
		isSaving.value = false;
	}
}

function cancel() {
	resetForms();
	$router.push({ name: 'substances-list' });
}
function resetForms() {
	form.value = {
		...formRef,
		components: JSON.parse(JSON.stringify(formRef.components))
	};
	if (formEl.value) {
		formEl.value.resetFields();
	}
}

const removeComponent = index => {
	form.value.components.splice(index, 1);
};

const addComponent = () => {
	if (selectedOption.value && selectedQuantity.value > 0) {
		const componentToAdd = {
			...selectedOption.value,
			quantityUsed: selectedQuantity.value
		};
		form.value.components = [...form.value.components, componentToAdd];
		formEl.value.clearValidate(['components']);
		selectedOption.value = null;
		selectedQuantity.value = 0;
		resetSelects.value = !resetSelects.value;
	}
};

function filterComponents(query) {
	componentOptions.value = allSubstances.value
		.filter(component => component.label.toLowerCase().includes(query.toLowerCase()))
		.slice(0, 50);
}

async function setComponents() {
	try {
		const res = await $api.substances.fetchSubstances({ limit: 999 });
		allSubstances.value = res.substances.map(x => ({
			id: x.id,
			label: `${x.name} (${x.storageLocation.room} ${x.storageLocation.name})`,
			category: x.category,
			quantity: x.quantity,
			quantityLeft: x.quantityLeft,
			quantityUnit: x.quantityUnit,
			quantityUsed: 0
		}));
		componentOptions.value = allSubstances.value.slice(0, 50);
	} catch (error) {
		$notifyUserAboutError(error);
	}
}

async function setStorages() {
	try {
		storages.value = await $api.storages.fetchStorages({ limit: 999 });
	} catch (error) {
		$notifyUserAboutError(error);
	}
}

const getSelectedOption = val => {
	selectedOption.value = val;
};
const getSelectedQuantity = val => {
	selectedQuantity.value = val;
};
</script>

<template>
	<div class="wrapper">
		<el-form ref="form-el" :model="form" :rules="rules" label-width="auto" label-position="top">
			<el-form-item :label="__('Name')" prop="name">
				<el-input v-model="form.name" :placeholder="__('Enter sample name')" />
			</el-form-item>
			<el-form-item :label="__('Add components')" prop="components">
				<suggested-components
					:future-quantity="futureQuantity"
					:component-options="componentOptions"
					:reset-selects="resetSelects"
					:form="form"
					@get-selected-option="getSelectedOption"
					@get-selected-quantity="getSelectedQuantity"
					@add-component="addComponent"
					@filter-components="filterComponents"
				/>
			</el-form-item>
			<el-form-item
				v-if="form.components.length > 0"
				:label="__('Components used')"
				prop="components"
			>
				<selected-components :form="form" @remove-component="removeComponent" />
			</el-form-item>
			<div class="align-horizontal">
				<el-form-item :label="__('Quantity unit')" prop="quantityUnit">
					<el-select v-model="form.quantityUnit" filterable :placeholder="__('Select a unit')">
						<el-option v-for="item of quantityUnits" :key="item" :label="item" :value="item" />
					</el-select>
				</el-form-item>
				<el-form-item :label="__('Quantity')" prop="quantity">
					<el-input-number v-model="form.quantity" :placeholder="__('Enter amount')" :min="0">
						<template #suffix>
							<span>{{ form.quantityUnit }}</span>
						</template>
					</el-input-number>
				</el-form-item>
			</div>

			<el-form-item :label="__('Expiration date')" prop="expirationDate">
				<el-date-picker
					v-model="form.expirationDate"
					type="date"
					:placeholder="__('Indicate expiration date')"
				/>
			</el-form-item>

			<el-form-item :label="__('Storage location')" prop="storageId">
				<el-select v-model="form.storageId" filterable :placeholder="__('Select storage location')">
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
					<rh-icon color="#7DCDEA" name="applications" class="icon" />{{ __('Create') }}
				</el-button>
			</div>
		</el-form>
	</div>
</template>

<style scoped>
:deep(.el-input-number) {
	width: 100%;
}
.el-form-item__content {
	gap: 10px;
}
</style>
