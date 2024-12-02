<script setup>
import {
	ElInput,
	ElButton,
	ElFormItem,
	ElOption,
	ElSelect,
	ElInputNumber,
	ElTag,
	ElForm
} from 'element-plus';
import { defineProps, computed, onMounted } from 'vue';
import { quantityUnits } from '../../../lib/constants/quantity-units.js';
import RhIcon from '../../../lib/components/rh-icon.vue';
import { $router } from '../../../lib/router/router.js';
import { existingFieldRules, existingNumberFieldRules } from '../constants.js';

const props = defineProps({
	order: {
		type: Object,
		default: null
	},
	isEdit: {
		type: Boolean,
		default: false
	},
	linkedRequests: { type: Array, default: null }
});
const combinedItems = computed(() => {
	return [
		...props.order.reagentRequests.map(item => ({ ...item, type: 'reagentRequests' })),
		...props.order.reagents.map(item => ({ ...item, type: 'reagents' })),
		...props.order.newReagents.map(item => ({ ...item, type: 'newReagents' }))
	];
});
const formRefs = {};

onMounted(() => {
	emit('substance-refs', formRefs);
});

const emit = defineEmits([
	'set-order',
	'remove-reagent',
	'update-item',
	'remove-linked-request',
	'substance-refs'
]);
const removeReagent = selectedReagent => emit('remove-reagent', selectedReagent);
const updateItem = (tempId, type, field, newValue) =>
	emit('update-item', tempId, type, field, newValue);
const removeLinkedRequest = selectedRequest => emit('remove-linked-request', selectedRequest);

function viewRequestDetails(request) {
	const target = $router.resolve({ name: 'request-details', params: { id: request.tempId } }).href;
	window.open(target, '_blank');
}
</script>

<template>
	<el-form
		v-for="(singleOrder, index) of combinedItems"
		:ref="el => (formRefs[`form-${index}`] = el)"
		:key="singleOrder.tempId"
		class="row"
		label-position="top"
		:model="combinedItems[index]"
	>
		<div class="linked desktop">
			<el-tag
				v-for="(request, reqIndex) of props.linkedRequests.filter(
					request => request.reagentName === singleOrder.reagentName
				)"
				:key="reqIndex"
				size="large"
				type="primary"
				:closable="props.isEdit"
				@click="() => viewRequestDetails(request)"
				@close="() => removeLinkedRequest(request)"
			>
				Linked request for {{ request.reagentName }}: {{ request.quantity }}
				{{ request.quantityUnit }} ({{ request.amount }})
			</el-tag>
		</div>
		<el-form-item prop="reagentName" :rules="existingFieldRules">
			<span class="desktop">Name</span>
			<el-input
				v-model="singleOrder.reagentName"
				placeholder="Add name"
				:disabled="!props.isEdit"
				@input="
					() =>
						updateItem(singleOrder.tempId, singleOrder.type, 'reagentName', singleOrder.reagentName)
				"
			/>
		</el-form-item>
		<el-form-item prop="quantityUnit" :rules="existingFieldRules">
			<span class="desktop">Unit</span>
			<el-select
				v-model="singleOrder.quantityUnit"
				filterable
				placeholder="Quantity unit"
				:disabled="!props.isEdit"
				@input="
					() =>
						updateItem(
							singleOrder.tempId,
							singleOrder.type,
							'quantityUnit',
							singleOrder.quantityUnit
						)
				"
			>
				<el-option v-for="unit of quantityUnits" :key="unit" :label="unit" :value="unit" />
			</el-select>
		</el-form-item>
		<el-form-item prop="quantity" :rules="existingNumberFieldRules">
			<span class="desktop">Quantity</span>
			<el-input-number
				v-model="singleOrder.quantity"
				placeholder="Quantity"
				:min="1"
				:disabled="!props.isEdit"
				@change="
					() => updateItem(singleOrder.tempId, singleOrder.type, 'quantity', singleOrder.quantity)
				"
			/>
		</el-form-item>
		<el-form-item prop="amount" :rules="existingNumberFieldRules">
			<span class="desktop">Amount</span>
			<el-input-number
				v-model="singleOrder.amount"
				placeholder="Amount"
				:min="1"
				:disabled="!props.isEdit"
				@change="
					() => updateItem(singleOrder.tempId, singleOrder.type, 'amount', singleOrder.reagentName)
				"
			/>
		</el-form-item>
		<el-button
			v-if="props.isEdit"
			:disabled="
				(singleOrder && singleOrder.type === 'reagentRequests') ||
				props.order.reagentRequests.includes(singleOrder)
			"
			type="danger"
			circle
			@click="() => removeReagent(singleOrder)"
		>
			<rh-icon color="white" name="remove"
		/></el-button>
		<div class="linked mobile">
			<el-tag
				v-for="(request, reqIndex) of props.linkedRequests.filter(
					request => request.reagentName === singleOrder.reagentName
				)"
				:key="reqIndex"
				size="large"
				type="primary"
				:closable="props.isEdit"
				@click="() => viewRequestDetails(request)"
				@close="() => removeLinkedRequest(request)"
			>
				Linked request for {{ request.reagentName }}: {{ request.quantity }}
				{{ request.quantityUnit }} ({{ request.amount }})
			</el-tag>
		</div>
	</el-form>
</template>
