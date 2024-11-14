<script setup>
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import {
	ElInput,
	ElForm,
	ElButton,
	ElFormItem,
	ElTag,
	ElAutocomplete,
	ElInputNumber
} from 'element-plus';
import RhIcon from '../../lib/components/rh-icon.vue';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid.js';
import { $route, $router } from '../../lib/router/router.js';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $api } from '../../lib/api/index.js';
import { formRef, formRules, newSubstanceRef, substanceRules } from './constants.js';
import { fetchSubstances, fetchRequests } from './retrieve-data.js';

const formEl = useTemplateRef('form-el');
const substanceFormEl = useTemplateRef('substance-form-el');
const isSaving = ref(false);
const searchQuery = ref('');
const incomingRequests = ref([]);
const linkedRequests = ref([]);
const loading = ref(false);
const form = ref(formRef);
const newSubtance = ref(newSubstanceRef);
const rules = ref(formRules);
const newSubstanceRules = ref(substanceRules);
const isRequest = computed(() => $route.value.name === 'new-order-request');

onMounted(() => {
	fetchRequests(incomingRequests, loading);
	const targetId = $route.value.query.id;
	if (targetId) {
		setSubstance(targetId, form, loading);
	}
});
const setSubstance = async (id, formValue, loadingState) => {
	await fetchSubstances(id, formValue, loadingState);
};
async function submit() {
	if (!(await $isFormValid(formEl))) return;
	isSaving.value = true;
	try {
		const response = await $api.orders.addOrder({ ...form.value });
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
	substanceFormEl.value.resetFields();
	$router.push({ name: 'orders-list' });
}

const fetchRequestSuggestions = async (queryString, callback) => {
	if (!queryString) {
		callback(incomingRequests.value.requests);
	} else {
		const filteredRequests = incomingRequests.value.requests.filter(request =>
			request.reagentName.toLowerCase().includes(queryString.toLowerCase())
		);
		return callback(filteredRequests);
	}
};

const linkRequest = selectedRequest => {
	const requestCopy = { ...selectedRequest };
	if (!linkedRequests.value.find(req => req.id === selectedRequest.id)) {
		linkedRequests.value.push(selectedRequest);
		form.value.reagentRequests.push(requestCopy);
	}
};
const removeLinkedRequest = request => {
	linkedRequests.value = linkedRequests.value.filter(r => r.id !== request.id);
	form.value.reagentRequests = form.value.reagentRequests.filter(r => r.id !== request.id);
};

function viewRequestDetails(request) {
	console.log(`Viewing request: ${request.id}`);
}
const addNewReagent = async () => {
	if (!(await $isFormValid(substanceFormEl))) return;
	form.value.reagents.push({
		reagentName: newSubtance.value.reagentName,
		quantityUnit: newSubtance.value.quantityUnit,
		quantity: newSubtance.value.quantity,
		amount: newSubtance.value.amount
	});
	substanceFormEl.value.resetFields();
};
function removeReagent(order) {
	const index = form.value.reagents.indexOf(order);
	if (index !== -1) {
		form.value.reagents.splice(index, 1);
	}
}
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
			<el-form-item v-if="isRequest" label="Linked Requests" class="requests" :rules="[]">
				<el-autocomplete
					v-model="searchQuery"
					:fetch-suggestions="fetchRequestSuggestions"
					clearable
					placeholder="Search for requests"
					@select="linkRequest"
				>
					<template #default="{ item }">
						<div>{{ item.reagentName }}</div>
					</template>
				</el-autocomplete>
				<div v-if="linkedRequests.length > 0" class="linked-requests-container">
					<el-tag
						v-for="request of linkedRequests"
						:key="request.id"
						closable
						@click="() => viewRequestDetails(request)"
						@close="() => removeLinkedRequest(request)"
					>
						{{ request.reagentName }} ({{ request.quantity }} {{ request.quantityUnit }})
					</el-tag>
				</div>
			</el-form-item>
			<div class="data-table">
				<h2 class="el-form-item__label">
					{{ isRequest ? `Requests to Order` : `Substances to Order` }}
				</h2>
				<div class="orders-container" max-height="350">
					<div class="row">
						<span>Name</span>
						<span>Unit</span>
						<span>Quantity</span>
						<span>Amount</span>
					</div>
					<div
						v-for="(order, index) of isRequest
							? [...form.reagentRequests, ...form.reagents]
							: form.reagents"
						:key="index"
						class="row"
					>
						<el-form-item
							:prop="`${isRequest ? 'reagentRequests' : 'reagents'}.${index}.reagentName`"
						>
							<el-input v-model="order.reagentName" placeholder="Enter name" />
						</el-form-item>
						<el-form-item
							:prop="`${isRequest ? 'reagentRequests' : 'reagents'}.${index}.quantityUnit`"
						>
							<el-input v-model="order.quantityUnit" placeholder="Quantity unit" />
						</el-form-item>
						<el-form-item :prop="`${isRequest ? 'reagentRequests' : 'reagents'}.${index}.quantity`">
							<el-input-number v-model="order.quantity" placeholder="Quantity" :min="1" />
						</el-form-item>
						<el-form-item :prop="`${isRequest ? 'reagentRequests' : 'reagents'}.${index}.amount`">
							<el-input-number v-model="order.amount" placeholder="Amount" :min="1" />
						</el-form-item>
						<el-button
							:disabled="!form.reagents.includes(order)"
							type="danger"
							circle
							@click="() => removeReagent(order)"
						>
							<rh-icon color="white" name="trash"
						/></el-button>
					</div>
					<el-form
						ref="substance-form-el"
						:model="newSubtance"
						:rules="newSubstanceRules"
						class="row"
					>
						<el-form-item prop="reagentName">
							<el-input v-model="newSubtance.reagentName" placeholder="Enter name" />
						</el-form-item>
						<el-form-item prop="quantityUnit">
							<el-input v-model="newSubtance.quantityUnit" placeholder="Enter unit" />
						</el-form-item>
						<el-form-item prop="quantity">
							<el-input-number v-model="newSubtance.quantity" placeholder="Quantity" :min="1" />
						</el-form-item>
						<el-form-item prop="amount">
							<el-input-number v-model="newSubtance.amount" placeholder="Amount" :min="1" />
						</el-form-item>
						<el-button type="info" circle @click="addNewReagent">
							<rh-icon color="white" name="plus"
						/></el-button>
					</el-form>
				</div>
			</div>
		</el-form>
		<div class="btn-container">
			<el-button @click="cancel">Cancel</el-button>
			<el-button :loading="isSaving" type="primary" @click="submit">Create</el-button>
		</div>
	</div>
</template>

<style>
.new-reagent-row {
	display: flex;
	flex-direction: row;
	gap: 2rem;
}
.row {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 8px;
	color: var(--rh-color-info-700);
}
.requests-table,
.data-table,
.btn-container {
	margin-top: 20px;
}
.el-form,
.add-btn {
	width: 100%;
}

.orders-container,
.requests,
.linked-requests-container {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.el-input-group__append,
.linked-requests-container,
.el-form-item__content {
	gap: 10px;
}
</style>
