<script setup>
import {
	ElForm,
	ElInput,
	ElButton,
	ElFormItem,
	ElOption,
	ElSelect,
	ElInputNumber
} from 'element-plus';
import { defineProps, useTemplateRef, ref, toRef } from 'vue';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid.js';
import RhIcon from '../../lib/components/rh-icon.vue';
import LinkedRequests from './linked-requests.vue';
import { quantityUnits } from '../../lib/constants/quantity-units.js';
import { substanceRules } from './constants.js';
import { newSubstanceRef } from './constants.js';
import { $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $api } from '../../lib/api/index.js';

const props = defineProps({
	order: {
		type: Object,
		default: null
	},
	isEdit: {
		type: Boolean,
		default: false
	},
	orderId: { type: String, default: null },
	setOrder: { type: Function, default: null }
});
const substanceFormEl = useTemplateRef('substance-form-el');
const newSubstance = ref(newSubstanceRef);
const newSubstanceRules = ref(substanceRules);
const order = toRef(props, 'order');

const addNewReagent = async () => {
	if (!(await $isFormValid(substanceFormEl))) return;
	const newReagent = {
		reagentName: newSubstance.value.reagentName,
		quantityUnit: newSubstance.value.quantityUnit,
		quantity: newSubstance.value.quantity,
		amount: newSubstance.value.amount
	};
	order.value.reagents = [...order.value.reagents, newReagent];
	substanceFormEl.value.resetFields();
};

const removeReagent = async item => {
	try {
		const response = await $api.orders.removeItemFromOrder(item.id);
		if (response.status === 'success') {
			props.setOrder(props.orderId);
		}
	} catch (error) {
		$notifyUserAboutError(error);
	}
};
</script>

<template>
	<linked-requests
		:order="order"
		:is-edit="isEdit"
		:order-id="props.orderId"
		:set-order="props.setOrder"
	/>
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
					<rh-icon color="white" name="plus"
				/></el-button>
			</el-form>
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
}
.row {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 8px;
	color: var(--rh-color-info-700);
}
</style>
