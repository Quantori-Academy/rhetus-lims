<script setup>
import { ref, onMounted, computed } from 'vue';
import { ElInput, ElForm, ElButton, ElFormItem, ElInputNumber, ElTag } from 'element-plus';
import RhIcon from '../../lib/components/rh-icon.vue';
import RequestsManagement from './requests-management.vue';
import { $router } from '../../lib/router/router.js';
import { $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $api } from '../../lib/api/index.js';
import NewSubstance from './new-substance.vue';
import { generateSubstanceRules } from './constants.js';

const props = defineProps({
	form: { type: Object, default: null },
	isRequest: { type: Boolean, default: false },
	linkedRequests: { type: Array, default: null }
});

const loading = ref(false);
const incomingRequests = ref([]);
const combinedItems = computed(() => [
	...props.form.reagentRequests.map(item => ({ ...item, type: 'reagentRequests' })),
	...props.form.reagents.map(item => ({ ...item, type: 'reagents' })),
	...props.form.newReagents.map(item => ({ ...item, type: 'newReagents' }))
]);
const isReagentAdded = computed(() => {
	return (
		props.form.reagents.length > 0 ||
		props.form.reagentRequests.length > 0 ||
		props.form.newReagents.length > 0
	);
});

const emit = defineEmits([
	'add-new-reagent',
	'remove-reagent',
	'link-request',
	'remove-request',
	'add-existing-reagent',
	'bulk-update',
	'cancel-form'
]);

onMounted(() => {
	fetchRequests();
});

function removeReagent(index) {
	emit('remove-reagent', index);
}
const addNewReagent = async newReagent => {
	emit('add-new-reagent', newReagent);
};
const addExistingReagent = async selectedReagent => {
	emit('add-existing-reagent', selectedReagent);
};
const removeLinkedRequest = async selectedReagent => {
	emit('remove-request', selectedReagent);
};
const linkRequest = selectedRequest => {
	emit('link-request', selectedRequest);
};
const cancel = () => {
	emit('cancel-form');
};

function viewRequestDetails(request) {
	const target = $router.resolve({ name: 'request-details', params: { id: request.id } }).href;
	window.open(target, '_blank');
}
const fetchRequests = async () => {
	loading.value = true;
	try {
		const data = await $api.requests.fetchRequests();
		incomingRequests.value = {
			...data,
			requests: [...data.requests.filter(request => request.status === 'pending')]
		};
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error retrieving request');
	} finally {
		loading.value = false;
	}
};
const fetchRequestSuggestions = async (queryString, callback) => {
	if (!queryString) {
		const filteredRequests = incomingRequests.value.requests.filter(
			request => !props.linkedRequests.some(linkedRequest => linkedRequest.id === request.id)
		);
		callback(filteredRequests);
	} else {
		const filteredRequests = incomingRequests.value.requests.filter(
			request =>
				request.reagentName.toLowerCase().includes(queryString.toLowerCase()) &&
				!props.linkedRequests.some(linkedRequest => linkedRequest.id === request.id)
		);
		return callback(filteredRequests);
	}
};
const substanceRules = computed(() => generateSubstanceRules(combinedItems.value));

// const substanceRules = computed(() => {
// 	const rules = {};
// 	combinedItems.value.forEach((item, index) => {
// 		rules[`combinedItems[${index}].reagentName`] = [
// 			{ required: true, message: `Reagent name for item ${index + 1} is required`, trigger: 'blur' }
// 		];
// 		rules[`combinedItems[${index}].quantity`] = [
// 			{
// 				type: 'number',
// 				required: true,
// 				message: `Quantity for item ${index + 1} is required`,
// 				trigger: 'blur'
// 			}
// 		];
// 		rules[`combinedItems[${index}].quantityUnit`] = [
// 			{
// 				required: true,
// 				message: `Quantity Unit for item ${index + 1} is required`,
// 				trigger: 'blur'
// 			}
// 		];
// 		rules[`combinedItems[${index}].amount`] = [
// 			{
// 				type: 'number',
// 				required: true,
// 				message: `Amount for item ${index + 1} is required`,
// 				trigger: 'blur'
// 			}
// 		];
// 	});
// 	return rules;
// });

const bulkUpdate = async () => {
	const newOrders = combinedItems.value.map(item => ({
		...item,
		quantity: item.quantity,
		amount: item.amount,
		quantityUnit: item.quantityUnit
	}));
	emit('bulk-update', newOrders);
};
</script>

<template>
	<requests-management
		:form="props.form"
		:is-request="props.isRequest"
		@link-request="linkRequest"
		@fetch-suggestions="fetchRequestSuggestions"
	/>
	<div class="data-table">
		<h2 class="el-form-item__label">
			{{ props.isRequest ? `Requests to Order` : `Substances to Order` }}
		</h2>
		<div class="orders-container" max-height="350">
			<div class="row">
				<span class="mobile">Name</span>
				<span class="mobile">Quantity</span>
				<span class="mobile">Unit</span>
				<span class="mobile">Amount</span>
			</div>

			<el-form
				v-for="(singleItem, index) of combinedItems"
				ref="substanceFormEl"
				:key="index"
				class="row"
				:model="props.form"
				:rules="substanceRules"
			>
				<div class="linked desktop">
					<el-tag
						v-for="(request, reqIndex) of props.linkedRequests.filter(
							request => request.id === singleItem.id
						)"
						:key="reqIndex"
						size="large"
						type="primary"
						closable
						@click="() => viewRequestDetails(request)"
						@close="() => removeLinkedRequest(request)"
					>
						Linked request for {{ request.name }}: {{ request.quantity }}
						{{ request.quantityUnit }} ({{ request.amount }})
					</el-tag>
				</div>
				<el-form-item :prop="`combinedItems.${index}.reagentName`">
					<span class="desktop">Name</span>
					<el-input v-model="singleItem.reagentName" placeholder="Enter name" />
				</el-form-item>
				<el-form-item :prop="`combinedItems.${index}.quantityUnit`">
					<span class="desktop">Unit</span>
					<el-input v-model="singleItem.quantityUnit" placeholder="Enter unit" />
				</el-form-item>
				<el-form-item :prop="`combinedItems.${index}.quantity`">
					<span class="desktop">Quantity</span>
					<el-input-number v-model="singleItem.quantity" placeholder="Enter quantity" />
				</el-form-item>
				<el-form-item :prop="`combinedItems.${index}.amount`">
					<span class="desktop">Amount</span>
					<el-input-number v-model="singleItem.amount" placeholder="Enter amount" />
				</el-form-item>
				<el-button
					:disabled="props.form.reagentRequests.includes(singleItem)"
					type="danger"
					circle
					@click="() => removeReagent(index, singleItem)"
				>
					<rh-icon color="white" name="remove"
				/></el-button>
				<div class="linked mobile">
					<el-tag
						v-for="(request, reqIndex) of props.linkedRequests.filter(
							request => request.id === singleItem.id
						)"
						:key="reqIndex"
						size="large"
						type="primary"
						closable
						@click="() => viewRequestDetails(request)"
						@close="() => removeLinkedRequest(request)"
					>
						Linked request for {{ request.reagentName }}: {{ request.quantity }}
						{{ request.quantityUnit }} ({{ request.amount }})
					</el-tag>
				</div>
			</el-form>
			<new-substance
				:form="props.form"
				@add-new-reagent="addNewReagent"
				@add-existing-reagent="addExistingReagent"
			/>
		</div>
		<div class="btn-container">
			<el-button @click="cancel">Cancel</el-button>
			<el-button type="primary" :disabled="!isReagentAdded" @click="bulkUpdate"
				>Add Order</el-button
			>
		</div>
	</div>
</template>
