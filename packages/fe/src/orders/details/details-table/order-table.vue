<script setup>
import { ElButton } from 'element-plus';
import { defineProps } from 'vue';
import ExistingSubstances from './existing-substances.vue';
import NewSubstances from './new-substances.vue';
const props = defineProps({
	order: {
		type: Object,
		default: null
	},
	isEdit: {
		type: Boolean,
		default: false
	},
	linkedRequests: { type: Array, default: null },
	isReagentAdded: {
		type: Boolean,
		default: false
	}
});

const emit = defineEmits([
	'remove-linked-request',
	'set-order',
	'toggle-off-edit',
	'remove-reagent',
	'update-item',
	'submit-substances',
	'add-new-reagent',
	'add-existing-reagent'
]);
const removeLinkedRequest = selectedRequest => emit('remove-linked-request', selectedRequest);
const setOrder = id => emit('set-order', id);
const removeReagent = selectedReagent => emit('remove-reagent', selectedReagent);
const addNewReagent = selectedReagent => emit('add-new-reagent', selectedReagent);
const addExistingReagent = selectedReagent => emit('add-existing-reagent', selectedReagent);
const submitSubstances = () => emit('submit-substances');
const updateItem = (tempId, type, field, newValue) =>
	emit('update-item', tempId, type, field, newValue);
</script>

<template>
	<div class="data-table">
		<h2 class="el-form-item__label">Substances to Order</h2>
		<div class="orders-container" max-height="350">
			<div class="row">
				<span class="mobile">Name</span>
				<span class="mobile">Unit</span>
				<span class="mobile">Quantity</span>
				<span class="mobile">Amount</span>
			</div>
			<existing-substances
				:order="props.order"
				:is-edit="props.isEdit"
				:linked-requests="props.linkedRequests"
				@set-order="setOrder"
				@remove-reagent="removeReagent"
				@remove-linked-request="removeLinkedRequest"
				@update-item="updateItem"
			/>
			<new-substances
				:order="props.order"
				:is-edit="props.isEdit"
				:is-reagent-added="isReagentAdded"
				@add-new-reagent="addNewReagent"
				@add-existing-reagent="addExistingReagent"
			/>
			<div v-if="isEdit" class="btn-container">
				<el-button type="primary" :disabled="!isReagentAdded" @click="submitSubstances"
					>Save</el-button
				>
			</div>
		</div>
	</div>
</template>

<style>
.el-form {
	display: flex;
	flex-direction: column;
	gap: 10px;
}
.el-input-number {
	width: 100%;
}
.orders-container {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.el-form-item__content {
	gap: 10px;
	width: 100%;
}
.data-table {
	margin-top: 20px;
	width: 100%;
}
.btn-container {
	display: flex;
	gap: 1rem;
}
.row {
	display: grid;
	grid-template-rows: auto auto;
	grid-template-columns: repeat(4, 1fr) 0.1fr;
	column-gap: 8px;
	color: var(--rh-color-info-700);
}

.linked {
	grid-row: 2;
	grid-column: 1 / -1;
	width: 100%;
	font-weight: 500;
}
.desktop {
	display: none;
}
@media (max-width: 820px) {
	.row {
		grid-template-columns: repeat(2, 1fr);
		.mobile {
			display: block;
		}
		.mobile {
			display: none;
		}
		.desktop {
			display: inline-block;
		}
		.linked {
			grid-row: 1;
			grid-column: 1 / -1;
		}
		.linked .el-tag {
			width: 100%;
		}
	}
}
</style>
