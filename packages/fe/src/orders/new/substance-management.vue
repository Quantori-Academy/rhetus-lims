<script setup>
import { ref, useTemplateRef, toRef } from 'vue';
import {
	ElInput,
	ElForm,
	ElButton,
	ElFormItem,
	ElInputNumber,
	ElOption,
	ElSelect
} from 'element-plus';
import RhIcon from '../../lib/components/rh-icon.vue';
import { quantityUnits } from '../../lib/constants/quantity-units.js';
import { substanceRules } from './constants.js';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid.js';
import { newSubstanceRef } from './constants.js';

const props = defineProps({
	form: { type: Object, default: null },
	isRequest: { type: Boolean, default: false }
});
const substanceFormEl = useTemplateRef('substance-form-el');
const form = toRef(props, 'form');
const newSubstance = ref(newSubstanceRef);
const newSubstanceRules = ref(substanceRules);

const addNewReagent = async () => {
	if (!(await $isFormValid(substanceFormEl))) return;
	form.value.reagents.push({
		reagentName: newSubstance.value.reagentName,
		quantityUnit: newSubstance.value.quantityUnit,
		quantity: newSubstance.value.quantity,
		amount: newSubstance.value.amount
	});
	substanceFormEl.value.resetFields();
};

function removeReagent(order) {
	const index = form.value.reagents.indexOf(order);
	if (index !== -1) {
		form.value.reagents.splice(index, 1);
	}
}
</script>

<template>
	<div class="data-table">
		<h2 class="el-form-item__label">
			{{ props.isRequest ? `Requests to Order` : `Substances to Order` }}
		</h2>
		<div class="orders-container" max-height="350">
			<div class="row">
				<span>Name</span>
				<span>Unit</span>
				<span>Quantity</span>
				<span>Amount</span>
			</div>
			<div
				v-for="(order, index) of props.isRequest
					? [...props.form.reagentRequests, ...props.form.reagents]
					: props.form.reagents"
				:key="index"
				class="row"
			>
				<el-form-item
					:prop="`${props.isRequest ? 'reagentRequests' : 'reagents'}.${index}.reagentName`"
				>
					<el-input v-model="order.reagentName" placeholder="Enter name" />
				</el-form-item>
				<el-form-item
					:prop="`${props.isRequest ? 'reagentRequests' : 'reagents'}.${index}.quantityUnit`"
				>
					<el-select v-model="order.quantityUnit" filterable placeholder="Quantity unit">
						<el-option v-for="unit of quantityUnits" :key="unit" :label="unit" :value="unit" />
					</el-select>
				</el-form-item>
				<el-form-item
					:prop="`${props.isRequest ? 'reagentRequests' : 'reagents'}.${index}.quantity`"
				>
					<el-input-number v-model="order.quantity" placeholder="Quantity" :min="1" />
				</el-form-item>
				<el-form-item :prop="`${props.isRequest ? 'reagentRequests' : 'reagents'}.${index}.amount`">
					<el-input-number v-model="order.amount" placeholder="Amount" :min="1" />
				</el-form-item>
				<el-button
					:disabled="!props.form.reagents.includes(order)"
					type="danger"
					circle
					@click="() => removeReagent(order)"
				>
					<rh-icon color="white" name="remove"
				/></el-button>
			</div>
			<el-form ref="substance-form-el" :model="newSubstance" :rules="newSubstanceRules" class="row">
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
					<rh-icon color="white" name="plus"
				/></el-button>
			</el-form>
		</div>
	</div>
</template>

<style scoped>
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
