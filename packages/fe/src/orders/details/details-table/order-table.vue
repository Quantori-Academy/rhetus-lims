<script setup>
import { defineProps } from 'vue';
import LinkedSubstances from './linked-substances.vue';
import ExistingSubstances from './existing-substances.vue';

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
	toggleEdit: { type: Function, default: null },
	linkedRequests: { type: Array, default: null }
});
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
			<linked-substances
				:order="props.order"
				:is-edit="props.isEdit"
				:linked-requests="linkedRequests"
				:set-order="props.setOrder"
				@toggle-edit="toggleEdit"
			/>
			<existing-substances
				:order="props.order"
				:is-edit="props.isEdit"
				:linked-requests="linkedRequests"
				:set-order="props.setOrder"
				@toggle-edit="toggleEdit"
			/>
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
