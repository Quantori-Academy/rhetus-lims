<script setup>
import { ref, onMounted, computed } from 'vue';
import {
	ElInput,
	ElForm,
	ElButton,
	ElFormItem,
	ElInputNumber,
	ElTag,
	ElOption,
	ElSelect
} from 'element-plus';
import RhIcon from '../../lib/components/rh-icon.vue';
import RequestsManagement from './requests-management.vue';
import { $router } from '../../lib/router/router.js';
import { $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $api } from '../../lib/api/index.js';
import NewSubstance from './new-substance.vue';
import { quantityUnits } from '../../lib/constants/quantity-units.js';
import { fieldRules, numberFieldRules } from './constants.js';
import { __ } from '../lib/locales/index.js';

const props = defineProps({
	form: { type: Object, default: null },
	isRequest: { type: Boolean, default: false },
	linkedRequests: { type: Array, default: null }
});
const loading = ref(false);
const incomingRequests = ref([]);
const combinedItems = computed(() => {
	return [
		...props.form.reagentRequests.map(item => ({ ...item, type: 'reagentRequests' })),
		...props.form.reagents.map(item => ({ ...item, type: 'reagents' })),
		...props.form.newReagents.map(item => ({ ...item, type: 'newReagents' }))
	];
});

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
	'submit',
	'cancel-form',
	'update-item'
]);

onMounted(() => {
	fetchRequests();
});

const removeReagent = (id, type) => emit('remove-reagent', id, type);
const addNewReagent = newReagent => emit('add-new-reagent', newReagent);
const addExistingReagent = selectedReagent => emit('add-existing-reagent', selectedReagent);
const removeLinkedRequest = selectedReagent => emit('remove-request', selectedReagent);
const linkRequest = selectedRequest => emit('link-request', selectedRequest);
const cancel = () => emit('cancel-form');
const submit = () => emit('submit');
const handleInputChange = (id, type, field, newValue) => {
	emit('update-item', {
		id,
		type,
		field,
		newValue
	});
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
			requests: data.requests.filter(request => request.status === 'pending')
		};
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		loading.value = false;
	}
};
const fetchRequestSuggestions = async (queryString, callback) => {
	const existingReagentIds = props.form.reagents.map(reagent => reagent.id);
	const filteredRequests = incomingRequests.value.requests.filter(request => {
		const isNotLinkedOrExisting =
			!props.linkedRequests.some(linkedRequest => linkedRequest.id === request.id) &&
			!existingReagentIds.includes(request.id);

		return (
			isNotLinkedOrExisting &&
			(!queryString || request.reagentName.toLowerCase().includes(queryString.toLowerCase()))
		);
	});
	callback(filteredRequests);
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
		<h2 class="el-form-item__label">{{ __('Substances to order') }}</h2>
		<div class="orders-container" max-height="350">
			<div class="row">
				<span class="mobile">{{ __('Name') }}</span>
				<span class="mobile">{{ __('Unit') }}</span>
				<span class="mobile">{{ __('Quantity') }}</span>
				<span class="mobile">{{ __('Amount') }}</span>
			</div>
			<el-form
				v-for="(singleItem, index) of combinedItems"
				:key="singleItem.id"
				ref="substanceFormEl"
				class="row__order_creation"
				:model="combinedItems[index]"
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
						{{ __('Linked request for') }} {{ request.name }}: {{ request.quantity }}
						{{ request.quantityUnit }} ({{ request.amount }})
					</el-tag>
				</div>
				<el-form-item prop="reagentName" :rules="fieldRules">
					<span class="desktop">{{ __('Name') }}</span>
					<el-input
						v-model="singleItem.reagentName"
						:placeholder="__('Enter name')"
						@input="
							() =>
								handleInputChange(
									singleItem.id,
									singleItem.type,
									'reagentName',
									singleItem.reagentName
								)
						"
					/>
				</el-form-item>
				<el-form-item prop="quantityUnit" :rules="fieldRules">
					<span class="desktop">{{ __('Unit') }}</span>
					<el-select
						v-model="singleItem.quantityUnit"
						filterable
						:placeholder="__('Enter unit')"
						@change="
							() =>
								handleInputChange(
									singleItem.id,
									singleItem.type,
									'quantityUnit',
									singleItem.quantityUnit
								)
						"
					>
						<el-option v-for="unit of quantityUnits" :key="unit" :label="unit" :value="unit" />
					</el-select>
				</el-form-item>
				<el-form-item prop="quantity" :rules="numberFieldRules">
					<span class="desktop">{{ __('Quantity') }}</span>
					<el-input-number
						v-model="singleItem.quantity"
						:min="1"
						:placeholder="__('Enter quantity')"
						@change="
							() =>
								handleInputChange(singleItem.id, singleItem.type, 'quantity', singleItem.quantity)
						"
					/>
				</el-form-item>
				<el-form-item prop="amount" :rules="numberFieldRules">
					<span class="desktop">{{ __('Amount') }}</span>
					<el-input-number
						v-model="singleItem.amount"
						:min="1"
						:placeholder="__('Enter amount')"
						@change="
							() => handleInputChange(singleItem.id, singleItem.type, 'amount', singleItem.amount)
						"
					/>
				</el-form-item>
				<el-button
					:disabled="
						(singleItem && singleItem.type === 'reagentRequests') ||
						props.form.reagentRequests.includes(singleItem)
					"
					type="danger"
					circle
					@click="() => removeReagent(singleItem.id, singleItem.type)"
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
						{{ __('Linked request for') }} {{ request.reagentName }}: {{ request.quantity }}
						{{ request.quantityUnit }} ({{ request.amount }})
					</el-tag>
				</div>
			</el-form>
			<new-substance
				:form="props.form"
				:combined-items="combinedItems"
				@add-new-reagent="addNewReagent"
				@add-existing-reagent="addExistingReagent"
			/>
		</div>
		<div class="btn-container">
			<el-button @click="cancel">{{ __('Cancel') }}</el-button>
			<el-button type="primary" :disabled="!isReagentAdded" @click="submit">{{
				__('Add Order')
			}}</el-button>
		</div>
	</div>
</template>
