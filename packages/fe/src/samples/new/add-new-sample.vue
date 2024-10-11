<script setup>
import { onMounted, reactive, ref, useTemplateRef } from 'vue';
import {
	ElInput,
	ElForm,
	ElDatePicker,
	ElButton,
	ElFormItem,
	ElSelectV2,
	ElInputNumber
} from 'element-plus';
import { quantityUnits } from '../../lib/constants/quantity-units';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid';
import { $router } from '../../lib/router/router';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg';
import { $api } from '../../lib/api';

const reagentsAndSamplesOptions = ref([]);

const formEl = useTemplateRef('form-el');
const form = ref({
	name: '',
	reagentsAndSamples: [],
	quantityUnit: '',
	size: 1,
	quantityLeft: 1,
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
	reagentsAndSamples: [requiredRule],
	quantityUnit: [requiredRule],
	size: [
		requiredRule,
		{ type: 'number', min: 0, message: 'Size cannot be negative', trigger: ['blur', 'change'] }
	],
	quantityLeft: [
		requiredRule,
		{
			type: 'number',
			min: 0,
			message: "You can't add a sample that has none left",
			trigger: ['blur', 'change']
		}
	],
	expirationDate: [requiredRule],
	room: [requiredRule],
	cabinet: [requiredRule],
	shelf: [requiredRule]
});

const isSaving = ref(false);

async function submit() {
	if (!(await $isFormValid(formEl))) return;

	isSaving.value = true;

	try {
		const response = await $api.samples.addSample(form.value);
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

async function setReagentsAndSamples() {
	try {
		const res = await $api.samples.fetchSamples();
		reagentsAndSamplesOptions.value = res.samples.map(x => ({ value: x.id, label: x.name }));
	} catch (error) {
		$notifyUserAboutError(error);
	}
}

onMounted(() => {
	setReagentsAndSamples();
});
</script>

<template>
	<div class="container">
		<div class="title">New Sample</div>
		<el-form ref="form-el" :model="form" :rules="rules" label-width="auto" label-position="top">
			<el-form-item label="Name" prop="name">
				<el-input v-model="form.name" placeholder="Enter sample name" />
			</el-form-item>
			<el-form-item label="Reagents/Samples used" prop="reagentsAndSamples">
				<el-select-v2
					v-model="form.reagentsAndSamples"
					filterable
					multiple
					placeholder="Select reagents/samples used in this sample"
					:options="reagentsAndSamplesOptions"
				/>
			</el-form-item>
			<div class="align-horizontal">
				<el-form-item label="Quantity unit" prop="quantityUnit">
					<el-select-v2
						v-model="form.quantityUnit"
						filterable
						placeholder="Select a unit"
						:options="quantityUnits.map(x => ({ value: x, label: x }))"
					/>
				</el-form-item>
				<el-form-item label="Size" prop="size">
					<el-input-number v-model="form.size" placeholder="Enter amount">
						<template #suffix>
							<span>{{ form.quantityUnit }}</span>
						</template>
					</el-input-number>
				</el-form-item>
				<el-form-item label="Quantity left" prop="quantityLeft">
					<el-input-number v-model="form.quantityLeft" placeholder="Enter amount">
						<template #suffix>
							{{ form.quantityUnit }}
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
