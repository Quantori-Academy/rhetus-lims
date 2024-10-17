<script setup>
import { reactive, ref, useTemplateRef } from 'vue';
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

const formEl = useTemplateRef('form-el');
const isSaving = ref(false);
const form = ref({
	name: '',
	casNumber: '',
	producer: '',
	catalogId: '',
	catalogLink: '',
	quantityUnit: '',
	quantity: 0,
	expirationDate: '',
	room: '',
	cabinet: '',
	shelf: '',
	description: ''
});

const requiredRule = {
	required: true,
	message: 'Please enter a value',
	trigger: ['blur', 'change']
};
const rules = reactive({
	name: [requiredRule],
	// casNumber: [requiredRule],
	producer: [requiredRule],
	catalogId: [requiredRule],
	catalogLink: [requiredRule],
	quantityUnit: [requiredRule],
	quantity: [
		requiredRule,
		{ type: 'number', min: 1, message: 'Quantity cannot be zero', trigger: ['blur', 'change'] }
	],
	expirationDate: [requiredRule],
	room: [requiredRule],
	cabinet: [requiredRule],
	shelf: [requiredRule]
});

async function submit() {
	if (!(await $isFormValid(formEl))) return;

	isSaving.value = true;

	try {
		const response = await $api.reagents.addReagent(form.value);
		$notify({ message: response.message, type: 'success' });
		$router.push({ name: 'dashboard' });
	} catch (error) {
		$notifyUserAboutError(error.statusText);
	} finally {
		isSaving.value = false;
	}
}

function cancel() {
	formEl.value.resetFields();
	$router.push({ name: 'dashboard' });
}
</script>

<template>
	<div class="container">
		<div class="title">New Reagent</div>
		<el-form ref="form-el" :model="form" :rules="rules" label-width="auto" label-position="top">
			<el-form-item label="Name" prop="name">
				<el-input v-model="form.name" placeholder="Enter reagent name" />
			</el-form-item>
			<el-form-item label="CAS number" prop="casNumber">
				<el-input v-model="form.casNumber" placeholder="Indicate CAS number" />
			</el-form-item>
			<el-form-item label="Producer" prop="producer">
				<el-input v-model="form.producer" />
			</el-form-item>
			<div class="align-horizontal">
				<el-form-item label="Catalog ID" prop="catalogId">
					<el-input v-model="form.catalogId" />
				</el-form-item>
				<el-form-item label="Catalog link" prop="catalogLink">
					<el-input v-model="form.catalogLink" />
				</el-form-item>
			</div>
			<div class="align-horizontal">
				<el-form-item label="Quantity" prop="quantity">
					<el-input-number v-model="form.quantity" placeholder="Enter amount" :min="0">
					</el-input-number>
				</el-form-item>
				<el-form-item label="Unit" prop="quantityUnit">
					<el-select v-model="form.quantityUnit" filterable placeholder="Select a unit">
						<el-option v-for="unit of quantityUnits" :key="unit" :label="unit" :value="unit" />
					</el-select>
				</el-form-item>
			</div>
			<el-form-item label="Price per unit" prop="unitPrice">
				<el-input v-model="form.unitPrice" />
			</el-form-item>
			<el-form-item label="Expiration date" prop="expirationDate">
				<el-date-picker
					v-model="form.expirationDate"
					type="date"
					format="YYYY-MM-DD"
					value-format="YYYY-MM-DD"
				/>
			</el-form-item>
			<div class="align-horizontal">
				<el-form-item label="Room" prop="room">
					<el-input v-model="form.room" placeholder="Enter room" />
				</el-form-item>
				<el-form-item label="Cabinet" prop="cabinet">
					<el-input v-model="form.cabinet" placeholder="Enter cabinet" />
				</el-form-item>
				<el-form-item label="Shelf" prop="shelf">
					<el-input v-model="form.shelf" placeholder="Enter shelf" />
				</el-form-item>
			</div>
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
	padding: 1rem;
	width: 42vw;
}
.align-horizontal {
	display: flex;
	gap: 18px;

	.el-form-item {
		flex-grow: 1;
		flex-basis: 0;
	}
}
.title {
	margin-bottom: 12px;
	color: black;
	font-weight: 500;
	font-size: large;
}
.btn-container {
	display: flex;
	justify-content: end;
}
.el-input-number {
	width: 100%;
}
.el-date-editor.el-input,
.el-date-editor.el-input__wrapper {
	width: 100%;
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
