<script setup>
import { onMounted, ref, useTemplateRef } from 'vue';
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
import { emptyComponent, formRules } from './constants';
import RhIcon from '../../../lib/components/rh-icon.vue';
import KetcherEditor from '../../../ketcher-editor/ketcher-editor.vue';
import { __ } from '../../../lib/locales';

const storages = ref([]);

const formEl = useTemplateRef('form-el');
const form = ref({
	name: '',
	components: [emptyComponent],
	quantityUnit: '',
	quantity: 1,
	quantityLeft: 1,
	expirationDate: '',
	storageId: '',
	structure: '',
	description: ''
});

const rules = ref(formRules);
const isSaving = ref(false);

async function submit() {
	if (!(await $isFormValid(formEl))) return;

	isSaving.value = true;
	try {
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

const removeComponent = index => {
	form.value.components.splice(index, 1);
};

const addComponent = () => {
	form.value.components.push(emptyComponent);
};

const allSubstances = ref([]);
const componentOptions = ref([]);

function filterComponents(query) {
	componentOptions.value = allSubstances.value
		.filter(component => component.label.toLowerCase().includes(query.toLowerCase()))
		.slice(0, 50);
}

const isOptionChosen = option =>
	!form.value.components.some(component => component.id === option.id);

async function setComponents() {
	try {
		const res = await $api.substances.fetchSubstances({ limit: 999 });
		allSubstances.value = res.substances.map(x => ({
			id: x.id,
			label: `${x.name} (${x.storageLocation.room} ${x.storageLocation.name})`,
			category: x.category,
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
		storages.value = await $api.storages.fetchStorages();
	} catch (error) {
		$notifyUserAboutError(error);
	}
}

onMounted(() => {
	setComponents();
	setStorages();
});
</script>

<template>
	<div class="wrapper">
		<el-form ref="form-el" :model="form" :rules="rules" label-width="auto" label-position="top">
			<el-form-item :label="__('Name')" prop="name">
				<el-input v-model="form.name" :placeholder="__('Enter sample name')" />
			</el-form-item>

			<el-form-item :label="__('Substances used')" prop="components">
				<div
					v-for="(component, index) of form.components"
					:key="component.id + index"
					:prop="'components.' + index + '.id'"
					class="align-horizontal w-full"
				>
					<el-select
						v-model="form.components[index]"
						value-key="id"
						filterable
						remote
						:remote-method="filterComponents"
					>
						<el-option
							v-for="item of componentOptions"
							:key="item.id"
							:label="`${item.label}`"
							:value="item"
							:disabled="!isOptionChosen(item)"
						>
							<div class="category-icons">
								<rh-icon
									:name="item.category.toLowerCase() === 'reagent' ? 'pod' : 'applications'"
								/>
								<span>{{ item.label }}</span>
							</div>
						</el-option>
					</el-select>
					<div class="w-full">
						<el-input-number
							v-model="component.quantityUsed"
							:min="0"
							:label="__('Quantity used')"
							:placeholder="__('Enter quantity used')"
						>
							<template #suffix>
								{{ component.quantityUnit }}
							</template>
						</el-input-number>
						<div class="subscript">
							{{ __('Future quantity') }}: {{ component.quantityLeft - component.quantityUsed }}
							{{ component.quantityUnit }}
						</div>
					</div>
					<el-button type="danger" @click="() => removeComponent(index)">
						<rh-icon color="white" name="remove" />
					</el-button>
				</div>
			</el-form-item>
			<div class="add-btn">
				<el-button @click="addComponent">{{ __('Add component') }}</el-button>
			</div>

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

<style>
.w-full {
	width: 100%;
}
.subscript {
	opacity: 0.6;
	font-size: small;
}
.add-btn {
	margin-top: -12px;
	margin-bottom: 12px;
	text-align: end;
}
@media (max-width: 768px) {
	.w-full {
		margin-bottom: 12px;
	}
}
</style>
