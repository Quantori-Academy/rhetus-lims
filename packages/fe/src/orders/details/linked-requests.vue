<script setup>
import { ref, onMounted, toRef, watch } from 'vue';
import { ElAutocomplete, ElTag, ElFormItem } from 'element-plus';
import { $api } from '../../lib/api/index.js';
import { $router } from '../../lib/router/router.js';
import { $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';

const props = defineProps({
	order: { type: Object, default: null },
	isEdit: { type: Boolean, default: false },
	setOrder: { type: Function, default: null }
});
const searchQuery = ref('');
const linkedRequests = ref([]);
const suggestedRequests = ref([]);
const loading = ref(false);
const order = toRef(props, 'order');

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
	loading.value = true;
	try {
		const data = await $api.requests.fetchRequests();
		suggestedRequests.value = {
			...data,
			requests: [...data.requests.filter(request => request.status === 'pending')]
		};
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error retrieving request');
	} finally {
		loading.value = false;
	}
};

const fetchRequestSuggestions = async (queryString, callback) => {
	if (!queryString) {
		callback(
			suggestedRequests.value.requests.filter(
				req => !linkedRequests.value.find(linked => linked.tempId === req.tempId)
			)
		);
	} else {
		const filteredRequests = suggestedRequests.value.requests.filter(request =>
			request.reagentName.toLowerCase().includes(queryString.toLowerCase())
		);

		const suggestions = filteredRequests.filter(
			req => !linkedRequests.value.find(linked => linked.tempId === req.tempId)
		);

		callback(suggestions);
	}
};

const linkRequest = selectedRequest => {
	const requestCopy = { ...selectedRequest };
	if (!linkedRequests.value.find(req => req.tempId === selectedRequest.tempId)) {
		linkedRequests.value.push(selectedRequest);
		order.value.reagentRequests.push(requestCopy);
	}
};
const removeLinkedRequest = async request => {
	console.log(request.tempid);
	linkedRequests.value = linkedRequests.value.filter(r => r.tempId !== request.tempId);
	try {
		const response = await $api.orders.removeItemFromOrder(request.tempId, {
			reagentRequests: request.tempId,
			reagents: []
		});
		if (response.status === 'success') {
			props.setOrder(order.value.id);
		}
	} catch (error) {
		$notifyUserAboutError(error);
	}
};

function viewRequestDetails(request) {
	const target = $router.resolve({ name: 'request-details', params: { id: request.id } }).href;
	window.open(target, '_blank');
}
</script>

<template>
	<el-form-item
		v-loading="loading"
		:label="
			linkedRequests.length > 0 || (linkedRequests.length == 0 && props.isEdit)
				? 'Linked Requests'
				: ''
		"
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
				<div>{{ item.reagentName }}</div>
			</template>
		</el-autocomplete>
		<div v-if="linkedRequests.length > 0" class="linked-requests-container">
			<el-tag
				v-for="request of linkedRequests"
				:key="request.id"
				:closable="props.isEdit"
				@click="() => viewRequestDetails(request)"
				@close="() => removeLinkedRequest(request)"
			>
				{{ request.reagentName }} ({{ request.quantity }} {{ request.quantityUnit }})
			</el-tag>
		</div>
	</el-form-item>
</template>

<style>
.requests {
	display: flex;
	flex-direction: column;
	gap: 8px;
}
.linked-requests-container {
	display: flex;
	flex-direction: row;
	gap: 10px;
}
.linked-requests-container span {
	width: max-content;
}
.el-form-item__label {
	width: max-content;
}
</style>
