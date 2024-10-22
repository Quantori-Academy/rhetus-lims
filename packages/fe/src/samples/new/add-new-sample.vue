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
import { quantityUnits } from '../../lib/constants/quantity-units';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid';
import { $router } from '../../lib/router/router';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg';
import { $api } from '../../lib/api';
import { emptyComponent, formRules } from './constants';
import rhIcon from '../../lib/components/rh-icon.vue';

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
	description: ''
});

const rules = ref(formRules);
const isSaving = ref(false);

async function submit() {
	if (!(await $isFormValid(formEl))) return;

	isSaving.value = true;

	try {
		const response = await $api.samples.addSample({
			...form.value,
			quantityLeft: form.value.quantity,
			components: form.value.components.map(x => ({
				id: x.id,
				category: x.category,
				quantityUsed: x.quantityUsed
			}))
		});
		$notify({ message: response.message, type: 'success' });
		$router.push({ name: 'reagents-list' });
	} catch (error) {
		$notifyUserAboutError(error.statusText);
	} finally {
		isSaving.value = false;
	}
}

function cancel() {
	formEl.value.resetFields();
	$router.push({ name: 'reagents-list' });
}

const removeComponent = index => {
	form.value.components.splice(index, 1);
};

const addComponent = () => {
	form.value.components.push(emptyComponent);
};

const componentOptions = ref([]);

const isOptionChosen = option =>
	!form.value.components.some(component => component.id === option.id);

async function setComponents() {
	try {
		const res = await $api.reagents.fetchSubstances();
		componentOptions.value = res.substances.map(x => ({
			id: x.id,
			label: x.name,
			category: x.category,
			quantityLeft: x.quantityLeft,
			quantityUnit: x.quantityUnit,
			quantityUsed: 0
		}));
	} catch (error) {
		$notifyUserAboutError(error);
	}
}

async function setStorages() {
	try {
		const data = await $api.storages.fetchStorages();
		storages.value = data.storages;
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
	<div class="container">
		<el-form ref="form-el" :model="form" :rules="rules" label-width="auto" label-position="top">
			<el-form-item label="Name" prop="name">
				<el-input v-model="form.name" placeholder="Enter sample name" />
			</el-form-item>

			<el-form-item label="Reagents/Samples used" prop="components">
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
						placeholder="Select reagent/sample"
					>
						<el-option
							v-for="item of componentOptions"
							:key="item.id"
							:label="item.label"
							:value="item"
							:disabled="!isOptionChosen(item)"
						/>
					</el-select>
					<div class="w-full">
						<el-input-number
							v-model="component.quantityUsed"
							:min="0"
							label="Quantity used"
							placeholder="Enter quantity used"
						>
							<template #suffix>
								{{ component.quantityUnit }}
							</template>
						</el-input-number>
						<div class="subscript">
							Future quantity: {{ component.quantityLeft - component.quantityUsed }}
							{{ component.quantityUnit }}
						</div>
					</div>
					<el-button type="danger" @click="() => removeComponent(index)">
						<rh-icon color="white" name="trash" />
					</el-button>
				</div>
			</el-form-item>
			<div class="add-btn">
				<el-button @click="addComponent">Add component</el-button>
			</div>

			<div class="align-horizontal">
				<el-form-item label="Quantity unit" prop="quantityUnit">
					<el-select v-model="form.quantityUnit" filterable placeholder="Select a unit">
						<el-option v-for="item of quantityUnits" :key="item" :label="item" :value="item" />
					</el-select>
				</el-form-item>
				<el-form-item label="Quantity" prop="quantity">
					<el-input-number v-model="form.quantity" placeholder="Enter amount" :min="0">
						<template #suffix>
							<span>{{ form.quantityUnit }}</span>
						</template>
					</el-input-number>
				</el-form-item>
			</div>

			<el-form-item label="Expiration date" prop="expirationDate">
				<el-date-picker
					v-model="form.expirationDate"
					type="date"
					format="YYYY-MM-DD"
					value-format="YYYY-MM-DD"
					placeholder="Pick a date (YYYY-MM-DD)"
				/>
			</el-form-item>

			<el-form-item label="Storage location" prop="storageId">
				<el-select v-model="form.storageId" placeholder="Select storage location">
					<el-option
						v-for="storage of storages"
						:key="storage.id"
						:label="storage.name"
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
.container {
	margin: 0 auto;
	padding-bottom: 18px;
	max-width: 48vw;
}
.w-full {
	width: 100%;
}
.align-horizontal {
	display: flex;
	gap: 18px;

	.el-form-item {
		flex-grow: 1;
		flex-basis: 0;
	}
}
.subscript {
	opacity: 0.6;
	font-size: small;
}
.btn-container {
	display: flex;
	justify-content: end;
}
.el-input-number {
	width: 100%;
	height: 32px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__wrapper {
	width: 100%;
}
.add-btn {
	margin-top: -12px;
	margin-bottom: 12px;
	text-align: end;
}

@media (max-width: 768px) {
	.container {
		padding-bottom: 24px;
		width: 80vw;
	}
	.align-horizontal {
		display: block;
	}
}
</style>
