<script setup>
import {
	ElForm,
	ElButton,
	ElFormItem,
	ElOption,
	ElSelect,
	ElInputNumber,
	ElAutocomplete
} from 'element-plus';
import { defineProps, useTemplateRef, ref, toRef, onMounted, watch } from 'vue';
import { $isFormValid } from '../../../lib/utils/form-validation/is-form-valid.js';
import RhIcon from '../../../lib/components/rh-icon.vue';
import { quantityUnits } from '../../../lib/constants/quantity-units.js';
import { newSubstanceRef, requiredRule } from '../constants.js';
import { $notifyUserAboutError } from '../../../lib/utils/feedback/notify-msg.js';
import { $api } from '../../../lib/api/index.js';

const isAutoFilled = ref(false);
const searchQuery = ref('');
const newSubstance = ref(newSubstanceRef);
const substanceRules = {
	reagentName: [
		{
			required: () => !isAutoFilled.value && searchQuery.value.trim() === '',
			message: 'Reagent name cannot be empty',
			trigger: 'blur'
		}
	],
	quantityUnit: [requiredRule('Unit')],
	quantity: [requiredRule('Quantity')],
	amount: [requiredRule('Amount')]
};
const newSubstanceRules = ref(substanceRules);
const substanceFormEl = useTemplateRef('substance-form-el');
const suggestedSubstances = ref([]);

const props = defineProps({
	order: {
		type: Object,
		default: null
	},
	isEdit: {
		type: Boolean,
		default: false
	}
});

const order = toRef(props, 'order');
const emit = defineEmits(['set-order']);
watch(searchQuery, newValue => {
	try {
		if (
			newValue &&
			!suggestedSubstances.value.some(suggestion =>
				suggestion.name.toLowerCase().includes(newValue.toLowerCase())
			)
		) {
			newSubstance.value.reagentName = newValue;
		}
	} catch (error) {
		$notifyUserAboutError(error);
	}
});

onMounted(() => {
	fetchRequests();
});
const fetchRequests = async () => {
	try {
		const params = {
			limit: 200
		};
		const data = await $api.substances.fetchSubstances(params);
		suggestedSubstances.value = data.substances.filter(
			substance => substance.category === 'reagent'
		);
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error retrieving substances');
	}
};
const fetchSubstanceSuggestions = async (queryString, callback) => {
	const query = searchQuery.value;
	const selectedReagents = order.value.reagents.map(reagent => reagent.reagentName);
	if (!queryString) {
		const filteredSuggestions = suggestedSubstances.value.filter(
			suggest => !selectedReagents.includes(suggest.name)
		);
		callback(filteredSuggestions);
	} else {
		const filteredRequests = suggestedSubstances.value.filter(
			suggest =>
				suggest.name.toLowerCase().includes(query.toLowerCase()) &&
				!selectedReagents.includes(suggest.name)
		);
		callback(filteredRequests);
	}
};
const onReagentSelect = async selectedRequest => {
	isAutoFilled.value = true;
	substanceFormEl.value.resetFields();
	const isReagentAdded = order.value.reagents.some(
		reagent => reagent.reagentName === selectedRequest.name
	);
	if (isReagentAdded) {
		return;
	}

	try {
		let newReagent = {
			...selectedRequest,
			reagentName: selectedRequest.name,
			quantity: 1,
			amount: 1
			// tempId: selectedRequest.id // use for msw
		};
		const body = {
			reagentRequests: [],
			reagents: [{ ...newReagent }],
			newReagents: []
		};
		// test id on prod
		const response = await $api.orders.addItemToOrder(order.value.id, body);
		if (response.status === 'success') {
			setOrder(order.value.id);
		}
		searchQuery.value = '';
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		isAutoFilled.value = false;
	}
};
const addNewReagent = async () => {
	const isValid = await $isFormValid(substanceFormEl);
	if (!isValid) return;
	newSubstance.value.reagentName = searchQuery.value;
	const newReagent = {
		name: newSubstance.value.reagentName,
		quantityUnit: newSubstance.value.quantityUnit,
		quantity: newSubstance.value.quantity,
		amount: newSubstance.value.amount,
		casNumber: '',
		producer: '',
		catalogId: '',
		catalogLink: '',
		unitPrice: null,
		description: '',
		structure: ''
	};
	const body = {
		reagentRequests: [],
		reagents: [],
		newReagents: [{ ...newReagent }]
	};
	const response = await $api.orders.addItemToOrder(order.value.id, body);
	if (response.status === 'success') {
		setOrder(props.order.id);
	}
	searchQuery.value = '';
	substanceFormEl.value.resetFields();
};

const setOrder = id => {
	emit('set-order', id);
};
</script>

<template>
	<el-form
		v-if="props.isEdit"
		ref="substance-form-el"
		:model="newSubstance"
		:rules="newSubstanceRules"
		class="row"
	>
		<el-form-item prop="reagentName">
			<span class="desktop">Name</span>
			<el-autocomplete
				v-model="searchQuery"
				placeholder="Search for reagents"
				popper-class="my-autocomplete"
				:fetch-suggestions="fetchSubstanceSuggestions"
				@select="onReagentSelect"
			>
				<template #default="{ item }">
					<div>{{ item.name }}</div>
				</template>
			</el-autocomplete>
		</el-form-item>
		<el-form-item prop="quantityUnit">
			<span class="desktop">Unit</span>
			<el-select v-model="newSubstance.quantityUnit" filterable placeholder="Enter unit">
				<el-option v-for="unit of quantityUnits" :key="unit" :label="unit" :value="unit" />
			</el-select>
		</el-form-item>
		<el-form-item prop="quantity">
			<span class="desktop">Quantity</span>
			<el-input-number v-model="newSubstance.quantity" placeholder="Quantity" :min="1" />
		</el-form-item>
		<el-form-item prop="amount">
			<span class="desktop">Amount</span>
			<el-input-number v-model="newSubstance.amount" placeholder="Amount" :min="1" />
		</el-form-item>
		<el-button type="info" circle @click="addNewReagent">
			<rh-icon color="white" name="plus"
		/></el-button>
	</el-form>
</template>
