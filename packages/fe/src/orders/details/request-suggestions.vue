<script setup>
import { ref, onMounted, toRef, watch } from 'vue';
import { ElAutocomplete, ElFormItem } from 'element-plus';
import { $api } from '../../lib/api/index.js';
import { $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';

const props = defineProps({
	order: { type: Object, default: null },
	isEdit: { type: Boolean, default: false }
});
const searchQuery = ref('');
const linkedRequests = ref([]);
const suggestedRequests = ref([]);
const order = toRef(props, 'order');
const emit = defineEmits(['update-linked-requests', 'set-order']);

watch(linkedRequests, newVal => {
	emit('update-linked-requests', newVal);
});

watch(
	() => props.order?.reagentRequests,
	newReagentRequests => {
		linkedRequests.value = [...newReagentRequests];
	},
	{ immediate: true }
);

onMounted(() => {
	fetchRequests();
});

const fetchRequests = async () => {
	try {
		const data = await $api.requests.fetchRequests();
		suggestedRequests.value = {
			...data,
			requests: data.requests.filter(request => request.status === 'pending')
		};
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error retrieving request');
	}
};

const fetchRequestSuggestions = async (queryString, callback) => {
	if (!queryString) {
		callback(
			suggestedRequests.value.requests.filter(
				req => !linkedRequests.value.find(linked => linked.id === req.id)
			)
		);
	} else {
		const filteredRequests = suggestedRequests.value.requests.filter(request =>
			request.reagentName.toLowerCase().includes(queryString.toLowerCase())
		);

		const suggestions = filteredRequests.filter(
			req => !linkedRequests.value.find(linked => linked.id === req.id)
		);

		callback(suggestions);
	}
};

const linkRequest = async selectedRequest => {
	const alreadyLinked = linkedRequests.value.find(req => req.tempId === selectedRequest.id);
	if (alreadyLinked) {
		return;
	}
	try {
		const body = {
			reagentRequests: [{ ...selectedRequest }],
			reagents: [],
			newReagents: []
		};
		const response = await $api.orders.addItemToOrder(order.value.id, body);
		if (response.status === 'success') {
			setOrder(order.value.id);
		}
	} catch (error) {
		$notifyUserAboutError(error);
	}
};
watch(linkedRequests, newVal => {
	emit('update-linked-requests', newVal);
});
watch(
	() => props.order?.reagentRequests,
	newReagentRequests => {
		linkedRequests.value = [...newReagentRequests];
		fetchRequests();
	},
	{ immediate: true }
);

const setOrder = id => {
	emit('set-order', id);
};
</script>

<template>
	<el-form-item
		:label="linkedRequests.length > 0 || props.isEdit ? 'Linked Requests' : ''"
		class="requests"
		:rules="[]"
	>
		<el-autocomplete
			v-if="props.isEdit"
			v-model="searchQuery"
			:fetch-suggestions="fetchRequestSuggestions"
			clearable
			placeholder="Search for requests"
			@select="linkRequest"
		>
			<template #default="{ item }">
				<div>
					{{ item.reagentName }} ({{ item.quantity }} {{ item.quantityUnit }}) - {{ item.amount }}
				</div>
			</template>
		</el-autocomplete>
	</el-form-item>
</template>

<style scoped>
.requests {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 8px;
	margin-top: -2rem;
}
.linked-requests-container {
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	gap: 10px;
}
.el-form-item {
	display: flex;
	width: 100%;
}
</style>
