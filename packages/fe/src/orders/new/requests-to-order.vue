<script setup>
import RhIcon from '../../lib/components/rh-icon.vue';
import { ElButton, ElTableColumn, ElTable, ElInput, ElFormItem } from 'element-plus';

const props = defineProps({
	orders: {
		type: Array,
		required: true,
		default: () => []
	},
	requests: {
		type: Array,
		required: true,
		default: () => []
	},
	loading: {
		type: Boolean,
		default: false
	}
});

const emit = defineEmits([
	'update-reagent',
	'remove-reagent',
	'row-click',
	'add-reagent',
	'toggle-edit'
]);

function toggleEdit(order) {
	order.editing = !order.editing;
}
function updateReagent(order) {
	order.editing = false;
	emit('update-reagent', order);
}

function removeReagent(row) {
	emit('remove-reagent', row);
}
function onRowClick(row) {
	emit('row-click', row);
}

function addReagent(row) {
	emit('add-reagent', row);
}
</script>

<template>
	<div class="orders-container" max-height="350">
		<h2 class="el-form-item__label">Reagents to Order</h2>
		<div class="header-row">
			<span>Reagent</span>
			<span>Quantity Unit</span>
			<span>Quantity</span>
			<span>Amount</span>
		</div>
		<p v-if="props.orders.length === 0">No reagents to order. Please add some items.</p>
		<div v-for="(order, index) of props.orders" :key="index" class="order-row">
			<el-form-item>
				<el-input
					v-model="order.reagentName"
					placeholder="Reagent name"
					:disabled="!order.editing"
				/>
			</el-form-item>
			<el-form-item>
				<el-input
					v-model="order.quantityUnit"
					placeholder="Quantity unit"
					:disabled="!order.editing"
				/>
			</el-form-item>
			<el-form-item>
				<el-input v-model="order.quantity" placeholder="Quantity" :disabled="!order.editing" />
			</el-form-item>
			<el-form-item>
				<el-input v-model="order.amount" placeholder="Amount" :disabled="!order.editing" />
			</el-form-item>
			<div class="action-buttons">
				<el-button v-if="order.editing" @click="() => updateReagent(order)">
					<rh-icon name="save" />
				</el-button>
				<el-button v-else @click="() => toggleEdit(order)">
					<rh-icon name="pencil" />
				</el-button>
				<el-button @click="() => removeReagent(order)">
					<rh-icon name="trash" />
				</el-button>
			</div>
		</div>
	</div>
	<div v-loading="loading" class="requests-table">
		<h2 class="el-form-item__label">Reagent Requests</h2>
		<el-table :data="props.requests" max-height="350" @row-click="onRowClick">
			<el-table-column prop="reagentName" min-width="150" label="Reagent" />
			<el-table-column prop="quantityUnit" min-width="80" label="Quantity Unit" />
			<el-table-column prop="quantity" min-width="80" label="Quantity" />
			<el-table-column prop="amount" min-width="80" label="Amount" />
			<el-table-column width="180">
				<template #default="{ row }">
					<el-button @click.stop="() => addReagent(row)">
						<rh-icon name="plus" />
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<style scoped>
.orders-container {
	display: flex;
	flex-direction: column;
	gap: 8px;
}
.orders-container h2 {
	width: max-content;
}
.header-row,
.order-row {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 8px;
	color: var(--rh-color-info-700);
}
</style>
