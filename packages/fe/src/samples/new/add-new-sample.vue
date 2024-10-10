<script setup>
import { ref } from 'vue';
import {
	ElInput,
	ElForm,
	ElDatePicker,
	ElButton,
	ElFormItem,
	ElSelectV2,
	ElInputNumber
} from 'element-plus';

const quantityUnits = [
	'ml',
	'L',
	'mg',
	'g',
	'kg',
	'µl',
	'ul',
	'nl',
	'cm³',
	'cc',
	'm³',
	'µg',
	'ug',
	'ng',
	'mol',
	'mmol',
	'µmol',
	'umol',
	'nmol',
	'M',
	'mM',
	'µM',
	'uM',
	'g/L',
	'mg/mL',
	'atm',
	'bar'
];

const reagents = [
	{
		value: 'aaaaa',
		label: 'Methane'
	},
	{
		value: 'aaaab',
		label: 'Ethane'
	},
	{
		value: 'aaaac',
		label: 'Propane'
	},
	{
		value: 'aaaad',
		label: 'Butan'
	},
	{
		value: 'aaaae',
		label: 'Heptane'
	}
];

const form = ref({
	name: '',
	reagentsAndSamples: [],
	quantityUnit: '',
	size: 0,
	quantityLeft: 0,
	expirationDate: '',
	room: '',
	cabinet: '',
	shelf: '',
	description: ''
});

function submit() {
	console.log(form.value);
}
</script>

<template>
	<div class="container">
		<div class="title">New Sample</div>
		<el-form :model="form" label-width="auto" label-position="top">
			<el-form-item label="Name">
				<el-input v-model="form.name" placeholder="Enter sample name" />
			</el-form-item>
			<el-form-item label="Reagents/Samples used">
				<el-select-v2
					v-model="form.reagentsAndSamples"
					filterable
					multiple
					placeholder="Select reagents/samples used in this sample"
					:options="reagents"
				/>
			</el-form-item>
			<div class="flex">
				<el-form-item label="Quantity unit">
					<el-select-v2
						v-model="form.quantityUnit"
						filterable
						placeholder="Select a unit"
						:options="quantityUnits.map(x => ({ value: x, label: x }))"
					/>
				</el-form-item>
				<el-form-item label="Size">
					<el-input-number v-model="form.size" placeholder="Enter amount">
						<template #suffix>
							<span>{{ form.quantityUnit }}</span>
						</template>
					</el-input-number>
				</el-form-item>
				<el-form-item label="Quantity left">
					<el-input-number v-model="form.quantityLeft" placeholder="Enter amount">
						<template #suffix>
							{{ form.quantityUnit }}
						</template>
					</el-input-number>
				</el-form-item>
			</div>
			<el-form-item label="Expiration date">
				<el-date-picker v-model="form.expirationDate" type="date" placeholder="Pick a date" />
			</el-form-item>
			<div class="flex">
				<el-form-item label="Room">
					<el-input v-model="form.room" placeholder="Enter room" />
				</el-form-item>
				<el-form-item label="Cabinet">
					<el-input v-model="form.cabinet" placeholder="Enter cabinet" />
				</el-form-item>
				<el-form-item label="Shelf">
					<el-input v-model="form.shelf" placeholder="Enter shelf" />
				</el-form-item>
			</div>
			<el-form-item label="Description">
				<el-input v-model="form.description" type="textarea" placeholder="Enter description" />
			</el-form-item>
			<div class="btn-container">
				<el-button>Cancel</el-button>
				<el-button type="primary" @click="submit">Create</el-button>
			</div>
		</el-form>
	</div>
</template>

<style>
.container {
	width: 600px;
}
.flex {
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
	width: 100% !important;
}
.el-date-editor.el-input,
.el-date-editor.el-input__wrapper {
	width: 100% !important;
}
</style>
