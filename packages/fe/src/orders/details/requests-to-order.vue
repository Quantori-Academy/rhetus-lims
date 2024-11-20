<script setup>
import {
	ElForm,
	ElInput,
	ElButton,
	ElFormItem,
	ElTable,
	ElTableColumn,
	ElOption,
	ElSelect,
	ElInputNumber
} from 'element-plus';
import { defineProps, useTemplateRef, ref, toRef } from 'vue';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid.js';
import RhIcon from '../../lib/components/rh-icon.vue';
import RequestsManagement from './requests-management.vue';
import { quantityUnits } from '../../lib/constants/quantity-units.js';
import { substanceRules } from './constants.js';
import { newSubstanceRef } from './constants.js';

const substanceFormEl = useTemplateRef('substance-form-el');
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
const newSubstance = ref(newSubstanceRef);
const newSubstanceRules = ref(substanceRules);
const order = toRef(props, 'order');

const addNewReagent = async () => {
	if (!(await $isFormValid(substanceFormEl))) return;
	order.value.reagents.push({
		reagentName: newSubstance.value.reagentName,
		quantityUnit: newSubstance.value.quantityUnit,
		quantity: newSubstance.value.quantity,
		amount: newSubstance.value.amount
	});
	substanceFormEl.value.resetFields();
};
</script>

<template>
	<requests-management :form="order.reagentRequests" :is-edit="isEdit" />
	<!-- SUBTANCES TO ORDER -->
	<el-form-item label="Substances to order" prop="reagentRequests">
		<el-table :data="order.reagentRequests">
			<el-table-column prop="reagentName" label="Name" />
			<el-table-column prop="quantityUnit" label="Quantity Unit" />
			<el-table-column prop="quantity" label="Quantity" />
			<el-table-column prop="amount" label="Amount" />
		</el-table>
		<!-- NEW SUBSTANCE -->
		<el-form
			v-if="props.isEdit"
			ref="substance-form-el"
			:model="newSubstance"
			:rules="newSubstanceRules"
			class="row"
		>
			<el-form-item prop="reagentName">
				<el-input v-model="newSubstance.reagentName" placeholder="Enter name" />
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
				<rh-icon color="white" name="plus" />
			</el-button>
		</el-form>
	</el-form-item>
</template>

<style>
.requests-table,
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
.data-table {
	margin-top: 20px;
}
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
</style>
