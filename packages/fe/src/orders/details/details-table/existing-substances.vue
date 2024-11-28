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
import { $notifyUserAboutError } from '../../../lib/utils/feedback/notify-msg.js';
import NewSubstances from './new-substances.vue';
import { $api } from '../../../lib/api/index.js';

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
<<<<<<< HEAD
const emit = defineEmits(['set-order']);
const createChangeTrackerEntry = item => {
	return Object.keys(item).reduce((acc, field) => {
		acc[field] = false;
		return acc;
	}, {});
};
const changeTracker = ref(props.order.reagents.map(createChangeTrackerEntry));
watch(
	() => props.order.reagents,
	reagents => {
		if (reagents.length > changeTracker.value.length) {
			for (let i = changeTracker.value.length; i < reagents.length; i++) {
				changeTracker.value.push(createChangeTrackerEntry(reagents[i]));
			}
		}
	},
	{ deep: true }
=======

const isOrderValid = computed(() => props.order.reagents.length > 0);
const changeTracker = ref(
	props.order.reagents.map(request =>
		Object.fromEntries(Object.keys(request).map(key => [key, false]))
	)
>>>>>>> 037952c (emit passed functions)
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

const emit = defineEmits(['set-order']);
const setOrder = id => {
	emit('set-order', id);
};
const watchRequestProperties = (request, index) => {
	Object.keys(request).forEach(key => createPropertyWatcher(request, key, index));
};

props.order.reagents.forEach((request, index) => {
	watchRequestProperties(request, index);
});

const checkForChanges = () => {
	return changeTracker.value.some(tracker => Object.values(tracker).includes(true));
};

const getChangedItems = () => {
	return props.order.reagents.filter((_, index) => {
		return Object.values(changeTracker.value[index]).includes(true);
	});
};
<<<<<<< HEAD
=======
const updateReagents = async () => {
	if (!checkForChanges()) {
		// temporary
		setOrder(props.order.id);
		return;
	}
	let changedSubstances = getChangedItems();
	try {
		const body = {
			orderItems: [...changedSubstances]
		};
		console.log(body);
		// const response = await $api.orders.updateItemInOrder(props.order.id, body);
		// if (response.status === 'success') {
		// 	await props.setOrder(props.order.id);
		// }
	} catch (error) {
		$notifyUserAboutError(error);
	}
};
>>>>>>> 037952c (emit passed functions)

const removeReagent = async selectedReagent => {
	try {
		// ! test id for prod
		const body = { reagentRequests: [], reagents: [selectedReagent.tempId] };
		const response = await $api.orders.removeItemFromOrder(props.order.id, body);
		if (response.status === 'success') {
<<<<<<< HEAD
			setOrder();
=======
			setOrder(props.order.id);
>>>>>>> 037952c (emit passed functions)
		}
	} catch (error) {
		$notifyUserAboutError(error);
	}
};
const setOrder = () => {
	emit('set-order', props.order.id);
};
</script>

<template>
	<el-form label-position="top">
		<div v-for="(singleOrder, index) of props.order.reagents" :key="index" class="row">
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
				:disabled="!props.order.reagents.includes(singleOrder)"
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
					type="primary"
					effect="dark"
				>
					Linked request for {{ singleOrder.reagentName }}: {{ request.quantity }}
					{{ request.quantityUnit }} ({{ request.amount }})
				</el-tag>
			</div>
		</div>
		<new-substances :order="props.order" :is-edit="props.isEdit" @set-order="setOrder" />
<<<<<<< HEAD
=======
		<div v-if="isEdit" class="btn-container">
			<el-button type="primary" :disabled="!isOrderValid" @click="updateReagents"
				>Update Reagents</el-button
			>
		</div>
>>>>>>> 037952c (emit passed functions)
	</el-form>
</template>
