<script setup>
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import { ElInput, ElForm, ElButton, ElFormItem } from 'element-plus';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid.js';
import { $route, $router } from '../../lib/router/router.js';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $api } from '../../lib/api/index.js';
import { requiredRule } from './constants.js';
import { debounce } from '../../lib/utils/debounce/debounce.js';
import { reagentDetails, requestInfo } from './test-data.js';
import RequestsToOrder from './requests-to-order.vue';
import ReagentsToOrder from './reagents-to-order.vue';

const formEl = useTemplateRef('form-el');
const isSaving = ref(false);
const isLoading = ref(true);
const requestsReceived = ref([]);
const existingReagents = ref([]);
const requestMode = computed(() => $route.value.name === 'new-order-request');

const form = ref({
	title: '',
	seller: '',
	reagents: [],
	reagentRequests: []
});

const rules = ref({
	title: [requiredRule('Title')],
	seller: [requiredRule('Seller')],
	...(requestMode.value
		? { reagentRequests: [requiredRule('reagentRequests')] }
		: { reagents: [requiredRule('reagents')] })
});

async function submit() {
	if (!(await $isFormValid(formEl))) return;
	isSaving.value = true;
	try {
		const response = await $api.orders.addOrder({
			...form.value
		});
		$notify({ message: response.message, type: 'success' });
		$router.push({ name: 'orders-list' });
	} catch (error) {
		$notifyUserAboutError(error.statusText);
	} finally {
		isSaving.value = false;
	}
}
function cancel() {
	formEl.value.resetFields();
	$router.push({ name: 'orders-list' });
}

const viewRequestDetails = row => {
	console.log('Viewing request:', row.id);
};

const setRequests = debounce(async () => {
	isLoading.value = true;
	try {
		const data = requestInfo;
		requestsReceived.value = data.requests;
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		isLoading.value = false;
	}
}, 200);
const setReagents = debounce(async () => {
	isLoading.value = true;
	try {
		existingReagents.value = reagentDetails;
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		isLoading.value = false;
	}
}, 200);

onMounted(() => {
	setRequests();
	setReagents();
});

function addReagent(row) {
	const sourceArray = requestMode.value ? requestsReceived : existingReagents;
	const targetArray = requestMode.value ? form.value.reagentRequests : form.value.reagents;
	const index = sourceArray.value.findIndex(item => item.id === row.id);
	if (index !== -1) {
		const reagent = sourceArray.value.splice(index, 1)[0];
		targetArray.push(reagent);
	}
}
function removeReagent(row) {
	const sourceArray = requestMode.value ? form.value.reagentRequests : form.value.reagents;
	const targetArray = requestMode.value ? requestsReceived : existingReagents;
	const index = sourceArray.findIndex(item => item.id === row.id);
	if (index !== -1) {
		const removedItem = sourceArray.splice(index, 1)[0];
		targetArray.value = [...targetArray.value, removedItem];
	}
}
const updateReagent = row => {
	const sourceArray = requestMode.value ? form.value.reagentRequests : form.value.reagents;
	const index = sourceArray.findIndex(item => item.id === row.id);
	if (index !== -1) {
		sourceArray[index] = {
			...sourceArray[index],
			reagentName: row.reagentName,
			quantityUnit: row.quantityUnit,
			quantity: row.quantity,
			amount: row.amount
		};
		$notify({ message: `Saved ${row.reagentName}`, type: 'success' });
	}
};

const addNewReagent = newReagent => {
	if (!$isFormValid(newReagent)) return;
	form.value.reagents.push({
		reagentName: newReagent.reagentName,
		quantityUnit: newReagent.quantityUnit,
		quantity: newReagent.quantity,
		amount: newReagent.amount,
		editing: false
	});
};
</script>

<template>
	<div class="wrapper">
		<el-form ref="form-el" :model="form" :rules="rules" label-width="auto" label-position="top">
			<el-form-item label="Title" prop="title">
				<el-input v-model="form.title" placeholder="Enter title" />
			</el-form-item>
			<el-form-item label="Seller" prop="seller">
				<el-input v-model="form.seller" placeholder="Enter seller name" />
			</el-form-item>
			<div class="data-table">
				<!-- REQUESTS TO ORDER -->
				<requests-to-order
					v-if="requestMode"
					:orders="form.reagentRequests"
					:requests="requestsReceived"
					:loading="isLoading"
					@update-reagent="updateReagent"
					@remove-reagent="removeReagent"
					@row-click="viewRequestDetails"
					@add-reagent="addReagent"
				/>
				<!-- REAGENTS TO ORDER -->
				<reagents-to-order
					v-else
					:orders="form.reagents"
					:reagents="existingReagents"
					@update-reagent="updateReagent"
					@remove-reagent="removeReagent"
					@add-reagent="addReagent"
					@add-new-reagent="addNewReagent"
				/>
			</div>
			<div class="btn-container">
				<el-button @click="cancel">Cancel</el-button>
				<el-button :loading="isSaving" type="primary" @click="submit">Create</el-button>
			</div>
		</el-form>
	</div>
</template>

<style>
.new-reagent-row,
.order-row {
	display: flex;
	flex-direction: row;
	gap: 2rem;
}
.requests-table,
.data-table,
.btn-container {
	margin-top: 20px;
}
.el-input-number {
	width: 100%;
}
.el-date-editor.el-input,
.el-date-editor.el-input__wrapper {
	width: 100%;
}
.add-btn {
	width: 100%;
}
</style>
