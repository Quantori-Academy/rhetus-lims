<script setup>
import { ElButton } from 'element-plus';
import { computed, defineProps, ref } from 'vue';
import LinkedSubstances from './linked-substances.vue';
import ExistingSubstances from './existing-substances.vue';
import { $api } from '../../../lib/api';
import { $notifyUserAboutError } from '../../../lib/utils/feedback/notify-msg';
import { $router } from '../../../lib/router/router';

const props = defineProps({
	order: {
		type: Object,
		default: null
	},
	isEdit: {
		type: Boolean,
		default: false
	},
	toggleEdit: { type: Function, default: null },
	linkedRequests: { type: Array, default: null }
});
const childOneRef = ref(null);
const childTwoRef = ref(null);
const isOrderValid = computed(
	() => [...props.order.reagents, ...props.order.reagentRequests].length > 0
);
const emit = defineEmits([
	'remove-linked-request',
	'set-order',
	'toggle-off-edit',
	'remove-reagent'
]);
const removeLinkedRequest = selectedRequest => {
	emit('remove-linked-request', selectedRequest);
};
const toggleOffEdit = () => {
	emit('toggle-off-edit');
};
const setOrder = id => {
	emit('set-order', id);
};
const removeReagent = selectedReagent => {
	emit('remove-reagent', selectedReagent);
};
const updateReagents = async () => {
	const changesFromChildOne = childOneRef.value.getChanges();
	const trackFromChildOne = childOneRef.value.trackChange();
	const trackFromChilTwo = childTwoRef.value.trackChange();
	const changesFromChildTwo = childTwoRef.value.getChanges();
	const combinedChanges = [...changesFromChildOne, ...changesFromChildTwo];

	if (!trackFromChildOne || !trackFromChilTwo) {
		$router.push({ name: 'order-details', params: { id: props.order.id } });
		return;
	}

	try {
		const body = {
			orderItems: combinedChanges
		};
		const response = await $api.orders.updateItemInOrder(props.order.id, body);
		if (response.status === 'success') {
			setOrder(props.order.id);
		}
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
			<linked-substances
				v-if="props.linkedRequests.length > 0"
				ref="childOneRef"
				:order="props.order"
				:is-edit="props.isEdit"
				:linked-requests="linkedRequests"
				@remove-linked-request="removeLinkedRequest"
				@set-order="setOrder"
				@toggle-off-edit="toggleOffEdit"
			/>
			<existing-substances
				ref="childTwoRef"
				:order="props.order"
				:is-edit="props.isEdit"
				:linked-requests="linkedRequests"
				@set-order="setOrder"
				@toggle-off-edit="toggleOffEdit"
				@remove-reagent="removeReagent"
			/>
			<div v-if="isEdit" class="btn-container">
				<el-button type="primary" :disabled="!isOrderValid" @click="updateReagents"
					>Update Form</el-button
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
