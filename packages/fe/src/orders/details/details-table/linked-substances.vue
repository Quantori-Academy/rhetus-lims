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
import { defineProps, computed, watch, ref } from 'vue';
import { quantityUnits } from '../../../lib/constants/quantity-units.js';
import RhIcon from '../../../lib/components/rh-icon.vue';
import { $router } from '../../../lib/router/router.js';

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
	linkedRequests: { type: Array, default: null }
});
const emit = defineEmits(['remove-linked-request']);
const removeLinkedRequest = selectedRequest => {
	emit('remove-linked-request', selectedRequest);
};

const createChangeTrackerEntry = item => {
	return Object.keys(item).reduce((acc, field) => {
		acc[field] = false;
		return acc;
	}, {});
};
const changeTracker = ref(props.order.reagentRequests.map(createChangeTrackerEntry));
watch(
	() => props.order.reagentRequests,
	newRequests => {
		if (newRequests.length > changeTracker.value.length) {
			for (let i = changeTracker.value.length; i < newRequests.length; i++) {
				changeTracker.value.push(createChangeTrackerEntry(newRequests[i]));
			}
		}
	},
	{ deep: true }
);
const changes = computed(() => {
	return getChangedItems();
});
const isChanged = computed(() => {
	return checkForChanges();
});
defineExpose({
	getChanges: () => changes.value,
	trackChange: () => isChanged.value
});

const createPropertyWatcher = (request, key, index) => {
	watch(
		() => request[key],
		(newVal, oldVal) => {
			if (newVal !== oldVal) {
				changeTracker.value[index][key] = true;
			}
		}
	);
};

const watchRequestProperties = (request, index) => {
	Object.keys(request).forEach(key => createPropertyWatcher(request, key, index));
};

props.order.reagentRequests.forEach((request, index) => {
	watchRequestProperties(request, index);
});

const checkForChanges = () => {
	return changeTracker.value.some(tracker => Object.values(tracker).includes(true));
};

const getChangedItems = () => {
	return props.order.reagentRequests.filter((_, index) => {
		return Object.values(changeTracker.value[index]).includes(true);
	});
};
function viewRequestDetails(request) {
	const target = $router.resolve({ name: 'request-details', params: { id: request.id } }).href;
	window.open(target, '_blank');
}
</script>

<template>
	<el-form label-position="top">
		<div v-for="(singleOrder, index) of props.order.reagentRequests" :key="index" class="row">
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

			<el-form-item>
				<span class="desktop">Name</span>
				<el-input v-model="singleOrder.reagentName" placeholder="Add name" :disabled="!isEdit" />
			</el-form-item>
			<el-form-item>
				<span class="desktop">Unit</span>
				<el-select
					v-model="singleOrder.quantityUnit"
					filterable
					placeholder="Quantity unit"
					:disabled="!isEdit"
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
					:disabled="!isEdit"
				/>
			</el-form-item>
			<el-form-item>
				<span class="desktop">Amount</span>
				<el-input-number
					v-model="singleOrder.amount"
					placeholder="Amount"
					:min="1"
					:disabled="!isEdit"
				/>
			</el-form-item>
			<el-button
				v-if="isEdit"
				:disabled="!order.reagents.includes(singleOrder)"
				type="danger"
				circle
				@click="() => removeReagent(singleOrder)"
			>
				<rh-icon color="white" name="remove"
			/></el-button>
			<div
				v-if="props.linkedRequests.some(request => request.reagentName === singleOrder.reagentName)"
				class="linked mobile"
			>
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
					Linked request for {{ singleOrder.reagentName }}: {{ request.quantity }}
					{{ request.quantityUnit }} ({{ request.amount }})
				</el-tag>
			</div>
		</div>
	</el-form>
</template>
