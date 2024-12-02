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
import { defineProps, useTemplateRef, ref, onMounted, computed } from 'vue';
import { $isFormValid } from '../../../lib/utils/form-validation/is-form-valid.js';
import RhIcon from '../../../lib/components/rh-icon.vue';
import { quantityUnits } from '../../../lib/constants/quantity-units.js';
import { newSubstanceRef, newSubstanceRules } from '../constants.js';
import { $notifyUserAboutError } from '../../../lib/utils/feedback/notify-msg.js';
import { $api } from '../../../lib/api/index.js';

const props = defineProps({
	order: {
		type: Object,
		default: null
	},
	isEdit: {
		type: Boolean,
		default: false
	},
	isReagentAdded: {
		type: Boolean,
		default: false
	}
});

const searchQuery = ref('');
const newReagentEl = useTemplateRef('new-reagent-el');
const newSubstance = ref(newSubstanceRef);
const rules = ref(newSubstanceRules);
const suggestedSubstances = ref([]);
const reagentName = computed({
	get: () => searchQuery.value,
	set: value => (searchQuery.value = newSubstance.value.reagentName = value)
});

const emit = defineEmits(['add-new-reagent', 'add-existing-reagent']);

onMounted(() => {
	fetchSubstances();
});
const fetchSubstances = async () => {
	try {
		const params = {
			limit: 200
		};
		const data = await $api.substances.fetchSubstances(params);
		suggestedSubstances.value = data.substances.filter(
			substance => substance.category === 'reagent'
		);
	} catch (error) {
		$notifyUserAboutError(error);
	}
};
const fetchSubstanceSuggestions = async (queryString, callback) => {
	const query = searchQuery.value;
	const selectedReagents = props.order.reagents.map(reagent => reagent.reagentName);
	const filterSuggestions = suggestions =>
		suggestions.filter(
			suggest =>
				(!queryString || suggest.name.toLowerCase().includes(query.toLowerCase())) &&
				!selectedReagents.includes(suggest.name)
		);
	const filteredSuggestions = filterSuggestions(suggestedSubstances.value);
	callback(filteredSuggestions);
};

const addExistingReagent = async selectedRequest => {
	const isReagentAdded = props.order.reagents.some(
		reagent => reagent.reagentName === selectedRequest.name
	);
	if (isReagentAdded) {
		return;
	}
	let existingSub = {
		...selectedRequest,
		reagentName: selectedRequest.name,
		quantity: 1,
		amount: 1
		// tempId: selectedRequest.id // use for msw
	};
	emit('add-existing-reagent', existingSub);
	searchQuery.value = '';
	newReagentEl.value.resetFields();
};
const addNewReagent = async () => {
	if (!(await $isFormValid(newReagentEl))) return;
	const newReagent = {
		...newSubstance.value,
		name: newSubstance.value.reagentName,
		casNumber: '',
		producer: '',
		catalogId: '',
		catalogLink: '',
		unitPrice: null,
		description: '',
		structure: ''
	};
	emit('add-new-reagent', newReagent);
	searchQuery.value = '';
	newReagentEl.value.resetFields();
};
</script>

<template>
	<h2 v-if="isReagentAdded && props.isEdit" class="el-form-item__label">Add Substances</h2>
	<el-form
		v-if="props.isEdit"
		ref="new-reagent-el"
		:model="newSubstance"
		:rules="rules"
		class="row"
	>
		<el-form-item prop="reagentName">
			<span class="desktop">Name</span>
			<el-autocomplete
				v-model="reagentName"
				placeholder="Add new reagents"
				:fetch-suggestions="fetchSubstanceSuggestions"
				@select="addExistingReagent"
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

<style scoped>
.el-form-item__label {
	display: flex;
	justify-content: left;
	max-width: 100%;
}
</style>
