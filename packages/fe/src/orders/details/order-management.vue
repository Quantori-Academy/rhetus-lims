<script setup>
import {
	ElForm,
	ElInput,
	ElButton,
	ElFormItem,
	ElOption,
	ElSelect,
	ElInputNumber,
	ElAutocomplete
} from 'element-plus';
import { defineProps, useTemplateRef, ref, toRef, onMounted, watch, computed } from 'vue';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid.js';
import RhIcon from '../../lib/components/rh-icon.vue';
import { quantityUnits } from '../../lib/constants/quantity-units.js';
import { newSubstanceRef } from './constants.js';
import { $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $api } from '../../lib/api/index.js';
import LinkedRequests from './linked-requests.vue';
const props = defineProps({
	order: {
		type: Object,
		default: null
	},
	isEdit: {
		type: Boolean,
		default: false
	},
	setOrder: { type: Function, default: null },
	updateOrder: { type: Function, default: null }
});
const substanceFormEl = useTemplateRef('substance-form-el');
const newSubstance = ref(newSubstanceRef);
const suggestedSubstances = ref([]);
const searchQuery = ref('');
const order = toRef(props, 'order');
const isOrderValid = computed(
	() => order.value.reagents.length > 0 || order.value.reagentRequests.length > 0
);
watch(searchQuery, newValue => {
	if (
		!suggestedSubstances.value.some(suggestion =>
			suggestion.name.toLowerCase().includes(newValue.toLowerCase())
		)
	) {
		newSubstance.value.reagentName = newValue;
	}
});

onMounted(() => {
	fetchRequests();
});
const fetchRequests = async () => {
	try {
		const data = await $api.substances.fetchSubstances();
		suggestedSubstances.value = [...data.substances];
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error retrieving substances');
	}
};

const fetchSubstanceSuggestions = async (queryString, callback) => {
	if (!queryString) {
		callback(suggestedSubstances.value);
	} else {
		const filteredRequests = suggestedSubstances.value.filter(suggest =>
			suggest.name.toLowerCase().includes(queryString.toLowerCase())
		);
		callback(filteredRequests);
	}
};

const onReagentSelect = selectedRequest => {
	const isReagentAdded = order.value.reagents.some(
		reagent => reagent.reagentName === selectedRequest.name
	);
	if (!isReagentAdded) {
		const newReagent = {
			reagentName: selectedRequest.name,
			quantity: 1,
			amount: 1,
			...selectedRequest
		};
		order.value.reagents.push(newReagent);
		searchQuery.value = '';
		substanceFormEl.value.resetFields();
	}
};

const addNewReagent = async () => {
	if (!(await $isFormValid(substanceFormEl))) return;
	newSubstance.value.reagentName = searchQuery.value;
	const newReagent = {
		reagentName: newSubstance.value.reagentName,
		quantityUnit: newSubstance.value.quantityUnit,
		quantity: newSubstance.value.quantity,
		amount: newSubstance.value.amount
	};

	order.value.reagents = [...order.value.reagents, newReagent];
	searchQuery.value = '';
	substanceFormEl.value.resetFields();
};

const removeReagent = async item => {
	try {
		const response = await $api.orders.removeItemFromOrder(item.id);
		if (response.status === 'success') {
			props.setOrder(order.value.id);
		}
	} catch (error) {
		$notifyUserAboutError(error);
	}
};
</script>

<template>
	<linked-requests :order="order" :is-edit="isEdit" :set-order="props.setOrder" />
	<div class="data-table">
		<h2 class="el-form-item__label">Substances to Order</h2>
		<div class="orders-container" max-height="350">
			<div class="row">
				<span>Name</span>
				<span>Unit</span>
				<span>Quantity</span>
				<span>Amount</span>
			</div>
			<div
				v-for="(singleOrder, index) of [...order.reagentRequests, ...order.reagents]"
				:key="index"
				class="row"
			>
				<el-form-item>
					<el-input
						v-model="singleOrder.reagentName"
						placeholder="Add name"
						:disabled="!props.isEdit"
					/>
				</el-form-item>
				<el-form-item>
					<el-select
						v-model="singleOrder.quantityUnit"
						filterable
						placeholder="Quantity unit"
						:disabled="!props.isEdit"
					>
						<el-option v-for="unit of quantityUnits" :key="unit" :label="unit" :value="unit" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input-number
						v-model="singleOrder.quantity"
						placeholder="Quantity"
						:min="1"
						:disabled="!props.isEdit"
					/>
				</el-form-item>
				<el-form-item>
					<el-input-number
						v-model="singleOrder.amount"
						placeholder="Amount"
						:min="1"
						:disabled="!props.isEdit"
					/>
				</el-form-item>
				<el-button
					v-if="props.isEdit"
					:disabled="!order.reagents.includes(singleOrder)"
					type="danger"
					circle
					@click="() => removeReagent(singleOrder)"
				>
					<rh-icon color="white" name="trash"
				/></el-button>
			</div>
			<el-form v-if="props.isEdit" ref="substance-form-el" :model="newSubstance" class="row">
				<el-form-item prop="reagentName">
					<el-autocomplete
						v-model="searchQuery"
						placeholder="Search for reagents"
						:fetch-suggestions="fetchSubstanceSuggestions"
						@select="onReagentSelect"
						><template #default="{ item }">
							<div>{{ item.name }}</div>
						</template></el-autocomplete
					>
				</el-form-item>
				<el-form-item prop="quantityUnit">
					<el-select v-model="newSubstance.quantityUnit" filterable placeholder="Enter unit">
						<el-option v-for="unit of quantityUnits" :key="unit" :label="unit" :value="unit" />
					</el-select>
				</el-form-item>
				<el-form-item prop="quantity">
					<el-input-number v-model="newSubstance.quantity" placeholder="Quantity" :min="1" />
				</el-form-item>
				<el-form-item prop="amount">
					<el-input-number v-model="newSubstance.amount" placeholder="Amount" :min="1" />
				</el-form-item>
				<el-button type="info" circle @click="addNewReagent">
					<rh-icon color="white" name="plus"
				/></el-button>
			</el-form>

			<div v-if="isEdit" class="btn-container">
				<el-button type="primary" :disabled="!isOrderValid" @click="props.updateOrder"
					>Save</el-button
				>
			</div>
		</div>
	</div>
</template>

<style>
.el-form {
	width: 100%;
}

.orders-container {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.el-form-item__content {
	gap: 10px;
}
.data-table {
	margin-top: 20px;
	width: 100%;
}
.row {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 8px;
	width: 100%;
	color: var(--rh-color-info-700);
}
.btn-container {
	display: flex;
	gap: 1rem;
}
</style>
