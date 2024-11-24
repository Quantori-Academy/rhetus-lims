<script setup>
import {
	ElInput,
	ElButton,
	ElFormItem,
	ElOption,
	ElSelect,
	ElInputNumber,
	ElTag
} from 'element-plus';
import { defineProps, toRef, computed, watch, ref } from 'vue';
import { quantityUnits } from '../../lib/constants/quantity-units.js';
import { $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $api } from '../../lib/api/index.js';
import RhIcon from '../../lib/components/rh-icon.vue';
import NewReagentManagement from './new-reagent-management.vue';

const props = defineProps({
	order: {
		type: Object,
		default: null
	},
	requests: {
		type: Array,
		default: null
	},
	isEdit: {
		type: Boolean,
		default: false
	},
	setOrder: { type: Function, default: null },
	updateOrder: { type: Function, default: null },
	linkedRequests: { type: Array, default: null }
});

const order = toRef(props, 'order');
const isOrderValid = computed(
	() => order.value.reagents.length > 0 || order.value.reagentRequests.length > 0
);
const removeReagent = async selectedReagent => {
	try {
		const body = { reagentRequests: [], reagents: [selectedReagent.tempId] };
		const response = await $api.orders.removeItemFromOrder(order.value.id, body);
		if (response.status === 'success') {
			await props.setOrder(order.value.id);
		}
	} catch (error) {
		$notifyUserAboutError(error);
	}
};

const baseState = ref(JSON.parse(JSON.stringify(props.order)));
const previousRequests = ref(JSON.parse(JSON.stringify(props.order)));
let updatedReagents = ref([]);
let updatedRequests = ref([]);
// watch(
// 	() => [...order.value.reagentRequests, ...order.value.reagents],
// 	() => {
// 		updatedRequests.value = [];
// 		updatedReagents.value = [];
// 		order.value.reagentRequests.forEach((newOrder, index) => {
// 			const previousOrderReq = previousRequests.value.reagentRequests[index];
// 			const baseOrderReq = baseState.value.reagentRequests[index];

// 			if (previousOrderReq) {
// 				const isChanged =
// 					newOrder.quantityUnit !== baseOrderReq.quantityUnit ||
// 					newOrder.quantity !== baseOrderReq.quantity ||
// 					newOrder.amount !== baseOrderReq.amount;

// 				if (isChanged) {
// 					updatedRequests.value.push(newOrder);
// 				}
// 			}
// 		});

// 		order.value.reagents.forEach((newOrder, index) => {
// 			const previousOrder = previousRequests.value.reagents[index];
// 			const baseOrder = baseState.value.reagents[index];

// 			if (previousOrder) {
// 				const isChanged =
// 					newOrder.quantityUnit !== baseOrder.quantityUnit ||
// 					newOrder.quantity !== baseOrder.quantity ||
// 					newOrder.amount !== baseOrder.amount;

// 				if (isChanged) {
// 					updatedReagents.value.push(newOrder);
// 				}
// 			}
// 		});
// 		previousRequests.value = JSON.parse(JSON.stringify(order.value));
// 	},
// 	{ deep: true }
// );
// Reusable function to check if an order has changed
const checkForChanges = (newOrder, baseOrder) => {
	return (
		newOrder.quantityUnit !== baseOrder.quantityUnit ||
		newOrder.quantity !== baseOrder.quantity ||
		newOrder.amount !== baseOrder.amount
	);
};

const processOrders = (currentOrders, previousOrders, baseStateOrders, updatedOrders) => {
	currentOrders.forEach((newOrder, index) => {
		const previousOrder = previousOrders[index];
		const baseOrder = baseStateOrders[index];

		if (previousOrder && checkForChanges(newOrder, baseOrder)) {
			updatedOrders.push(newOrder);
		}
	});
};

watch(
	() => [...order.value.reagentRequests, ...order.value.reagents],
	() => {
		updatedRequests.value = [];
		updatedReagents.value = [];
		// Process reagentRequests and reagents using the reusable function
		processOrders(
			order.value.reagentRequests,
			previousRequests.value.reagentRequests,
			baseState.value.reagentRequests,
			updatedRequests.value
		);
		processOrders(
			order.value.reagents,
			previousRequests.value.reagents,
			baseState.value.reagents,
			updatedReagents.value
		);
		previousRequests.value = JSON.parse(JSON.stringify(order.value));
	},
	{ deep: true }
);

const mapOrders = orders => {
	return orders.map(order => ({
		quantity: order.quantity,
		quantityUnit: order.quantityUnit,
		id: order.tempId,
		amount: order.amount
	}));
};

const updateRequests = async () => {
	const req = mapOrders(updatedReagents.value);
	const reag = mapOrders(updatedRequests.value);
	try {
		const body = {
			reagentRequests: reag,
			reagents: req
		};
		console.log(body);
		// const response = await $api.orders.addItemToOrder(order.value.id, body);
		// if (response.status === 'success') {
		// 	await props.setOrder(order.value.id);
		// }
	} catch (error) {
		$notifyUserAboutError(error);
	}
};
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
			<div
				v-for="(singleOrder, index) of [...props.order.reagentRequests, ...props.order.reagents]"
				:key="index"
				class="row"
			>
				<div
					v-if="
						props.linkedRequests.some(request => request.reagentName === singleOrder.reagentName)
					"
					class="linked desktop"
				>
					<el-tag
						v-for="(request, reqIndex) of props.linkedRequests.filter(
							request => request.reagentName === singleOrder.reagentName
						)"
						:key="reqIndex"
						type="primary"
						effect="dark"
					>
						Linked request for {{ singleOrder.reagentName }}: {{ request.quantity }}
						{{ request.quantityUnit }} ({{ request.amount }})
					</el-tag>
				</div>
				<el-form-item>
					<span class="desktop">Name</span>
					<el-input
						v-model="singleOrder.reagentName"
						placeholder="Add name"
						:disabled="!props.isEdit"
					/>
				</el-form-item>
				<el-form-item>
					<span class="desktop">Unit</span>
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
					<span class="desktop">Quantity</span>
					<el-input-number
						v-model="singleOrder.quantity"
						placeholder="Quantity"
						:min="1"
						:disabled="!props.isEdit"
					/>
				</el-form-item>
				<el-form-item>
					<span class="desktop">Amount</span>
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
					<rh-icon color="white" name="remove"
				/></el-button>
				<div
					v-if="
						props.linkedRequests.some(request => request.reagentName === singleOrder.reagentName)
					"
					class="linked mobile"
				>
					<el-tag
						v-for="(request, reqIndex) of props.linkedRequests.filter(
							request => request.reagentName === singleOrder.reagentName
						)"
						:key="reqIndex"
						type="primary"
						effect="dark"
					>
						Linked request for {{ singleOrder.reagentName }}: {{ request.quantity }}
						{{ request.quantityUnit }} ({{ request.amount }})
					</el-tag>
				</div>
			</div>
			<new-reagent-management :order="props.order" :is-edit="props.isEdit" :set-order="setOrder" />
			<div v-if="isEdit" class="btn-container">
				<el-button type="primary" :disabled="!isOrderValid" @click="updateRequests">Save</el-button>
			</div>
		</div>
	</div>
</template>

<style>
.el-form {
	width: 100%;
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
	grid-template-columns: repeat(5, 1fr);
	column-gap: 8px;
	color: var(--rh-color-info-700);
}
.row .el-form-item {
	margin-bottom: 5px;
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
