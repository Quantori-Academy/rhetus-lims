<script setup>
import { ref, useTemplateRef } from 'vue';
import { ElInput, ElForm, ElButton, ElFormItem, ElTag, ElAutocomplete } from 'element-plus';
import RhIcon from '../../lib/components/rh-icon.vue';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid.js';
import { $router } from '../../lib/router/router.js';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $api } from '../../lib/api/index.js';
import { requiredRule } from './constants.js';
import { requestInfo } from './test-data.js';

const formEl = useTemplateRef('form-el');
const isSaving = ref(false);
const searchQuery = ref('');
const linkedRequests = ref([]);
const requestsToLink = ref([]);

const form = ref({
	title: '',
	seller: '',
	reagentRequests: [],
	reagents: []
});

const newReagent = ref({
	reagentName: '',
	quantityUnit: '',
	quantity: 1,
	amount: 1
});
const rules = ref({
	title: [requiredRule('Title')],
	seller: [requiredRule('Seller')]
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

const fetchRequestSuggestions = (queryString, callback) => {
	console.log(queryString);
	if (!queryString) {
		callback(requestInfo.requests);
	} else {
		const filteredRequests = requestInfo.requests.filter(request =>
			request.reagentName.toLowerCase().includes(queryString.toLowerCase())
		);
		return callback(filteredRequests);
	}
};
const linkRequest = selectedRequest => {
	if (!requestsToLink.value.find(req => req.id === selectedRequest.id)) {
		requestsToLink.value.push(selectedRequest);
	}
};
const confirmLinkedRequests = () => {
	linkedRequests.value = [...linkedRequests.value, ...requestsToLink.value];
	form.value.reagentRequests = [...form.value.reagentRequests, ...requestsToLink.value];
	requestsToLink.value = [];
};
const removeLinkedRequest = request => {
	requestsToLink.value = requestsToLink.value.filter(r => r.id !== request);
	linkedRequests.value = linkedRequests.value.filter(r => r.id !== request);
};

function viewRequestDetails(row) {
	console.log(`Viewing request: ${row.id}`);
}

const addNewReagent = () => {
	if (!newReagent.value.reagentName || !newReagent.value.quantityUnit) {
		return $notifyUserAboutError('Please fill out all required fields.');
	}
	form.value.reagents.push({
		reagentName: newReagent.value.reagentName,
		quantityUnit: newReagent.value.quantityUnit,
		quantity: newReagent.value.quantity,
		amount: newReagent.value.amount
	});
	newReagent.value = {
		reagentName: '',
		quantityUnit: '',
		quantity: 1,
		amount: 1
	};
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
			<el-form-item label="Linked Requests" class="requests" :rules="[]">
				<el-autocomplete
					v-model="searchQuery"
					:fetch-suggestions="fetchRequestSuggestions"
					clearable
					class="inline-input"
					placeholder="Search for requests"
					empty-text="No results found"
					@select="linkRequest"
				>
					<template v-if="requestsToLink.length > 0" #append>
						<el-tag
							v-for="request of requestsToLink"
							:key="request.id"
							closable
							@close="() => removeLinkedRequest(request.id)"
						>
							<span>{{ request.reagentName }}</span>
						</el-tag>
					</template>
					<template #default="{ item }">
						<div>{{ item.reagentName }}</div>
					</template>
				</el-autocomplete>
				<el-button type="primary" @click="confirmLinkedRequests">Link request</el-button>

				<template v-if="linkedRequests.length > 0" #prepend>
					<el-tag
						v-for="request of linkedRequests"
						:key="request.id"
						closable
						@close="() => removeLinkedRequest(request.id)"
					>
						{{ request.reagentName }}
					</el-tag>
				</template>
			</el-form-item>
			<div v-if="linkedRequests.length > 0" class="linked-requests-container">
				<el-tag
					v-for="request of linkedRequests"
					:key="request.id"
					closable
					@click="viewRequestDetails"
					@close="() => removeLinkedRequest(request.id)"
				>
					{{ request.reagentName }} ({{ request.quantity }} {{ request.quantityUnit }})
				</el-tag>
			</div>
			<div class="data-table">
				<div class="orders-container" max-height="350">
					<h2 class="el-form-item__label">Requests to Order</h2>
					<div class="header-row">
						<span>Reagent</span>
						<span>Quantity Unit</span>
						<span>Quantity</span>
						<span>Amount</span>
					</div>
					<div
						v-for="(order, index) of [...form.reagentRequests, ...form.reagents]"
						:key="index"
						class="order-row"
					>
						<el-form-item>
							<el-input v-model="order.reagentName" placeholder="Reagent name" />
						</el-form-item>
						<el-form-item>
							<el-input v-model="order.quantityUnit" placeholder="Quantity unit" />
						</el-form-item>
						<el-form-item>
							<el-input v-model="order.quantity" placeholder="Quantity" />
						</el-form-item>
						<el-form-item>
							<el-input v-model="order.amount" placeholder="Amount" />
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
					<el-form :model="newReagent" class="order-row">
						<el-form-item prop="reagentName">
							<el-input v-model="newReagent.reagentName" placeholder="Enter reagent name" />
						</el-form-item>
						<el-form-item prop="quantityUnit">
							<el-input v-model="newReagent.quantityUnit" placeholder="Enter unit" />
						</el-form-item>
						<el-form-item prop="quantity">
							<el-input v-model="newReagent.quantity" min="1" />
						</el-form-item>
						<el-form-item prop="amount">
							<el-input v-model="newReagent.amount" min="1" />
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
.el-form {
	width: 100%;
}
.el-date-editor.el-input,
.el-date-editor.el-input__wrapper {
	width: 100%;
}
.add-btn {
	width: 100%;
}
.orders-container,
.requests {
	display: flex;
	flex-direction: column;
	gap: 8px;
}
.orders-container h2 {
	width: max-content;
}
.header-row,
.order-row {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 8px;
	color: var(--rh-color-info-700);
}
.linked-requests-container {
	display: flex;
	flex-direction: row;
}
.el-input-group__append,
.linked-requests-container,
.el-form-item__content {
	gap: 10px;
}
</style>
