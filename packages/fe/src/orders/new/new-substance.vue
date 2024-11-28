<script setup>
import { ref, useTemplateRef, onMounted, watch, computed } from 'vue';
import {
	ElForm,
	ElButton,
	ElFormItem,
	ElInputNumber,
	ElOption,
	ElSelect,
	ElAutocomplete
} from 'element-plus';
import RhIcon from '../../lib/components/rh-icon.vue';
import { quantityUnits } from '../../lib/constants/quantity-units.js';
import { newSubstanceRef, generateNewSubstanceRules } from './constants.js';
import { $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $api } from '../../lib/api/index.js';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid.js';

const props = defineProps({
	form: { type: Object, default: null }
});
const newSubstanceEl = useTemplateRef('new-substance');
const newSubstance = ref(newSubstanceRef);
const rules = computed(() => generateNewSubstanceRules());
const searchQuery = ref('');
const suggestedSubstances = ref([]);
watch(searchQuery, newVal => {
	newSubstance.value.name = newVal;
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
		$notifyUserAboutError(error.message || 'Error retrieving substances');
	}
};
const addNewReagent = async () => {
	if (!(await $isFormValid(newSubstanceEl))) return;
	const newReagent = {
		reagentName: newSubstance.value.reagentName,
		quantity: newSubstance.value.quantity,
		amount: newSubstance.value.amount,
		quantityUnit: newSubstance.value.quantityUnit
	};
	emit('add-new-reagent', newReagent);
	searchQuery.value = '';
	newSubstanceEl.value.resetFields();
};
const addExistingReagent = async selectedRequest => {
	const isReagentAdded = props.form.reagents.some(
		reagent => reagent.reagentName === selectedRequest.name
	);
	if (isReagentAdded) {
		return;
	}

	let newReagent = {
		...selectedRequest,
		reagentName: selectedRequest.name,
		id: selectedRequest.id,
		quantity: 1,
		amount: 1,
		quantityUnit: selectedRequest.quantityUnit
		// tempId: selectedRequest.id // use for msw
	};
	emit('add-existing-reagent', newReagent);
	newSubstanceEl.value.resetFields();
};
const fetchSubstanceSuggestions = async (queryString, callback) => {
	const query = searchQuery.value;
	const selectedReagents = props.form.reagents.map(reagent => reagent.reagentName);
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
</script>

<template>
	<el-form ref="new-substance" :model="newSubstance" class="row" :rules="rules">
		<el-form-item prop="reagentName">
			<span class="desktop">Name</span>
			<el-autocomplete
				v-model="searchQuery"
				placeholder="Search for reagents"
				popper-class="my-autocomplete"
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
			<span class="desktop">Quantity</span>
			<el-input-number v-model="newSubstance.amount" placeholder="Amount" :min="1" />
		</el-form-item>
		<el-button type="info" circle @click="addNewReagent">
			<rh-icon color="white" name="plus"
		/></el-button>
	</el-form>
</template>
