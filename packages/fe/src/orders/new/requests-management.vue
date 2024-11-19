<script setup>
import { ref, onMounted, toRef } from 'vue';
import { ElAutocomplete, ElTag, ElFormItem } from 'element-plus';
import { $api } from '../../lib/api/index.js';
import { $router } from '../../lib/router/router.js';
import { $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';

const props = defineProps({
	form: { type: Object, default: null },
	isRequest: { type: Boolean, default: false }
});
const searchQuery = ref('');
const linkedRequests = ref([]);
const incomingRequests = ref([]);
const loading = ref(false);
const form = toRef(props, 'form');

onMounted(() => {
	fetchRequests(incomingRequests, loading);
});
const fetchRequests = async (incomingRequests, loading) => {
	loading.value = true;
	try {
		const data = await $api.requests.fetchRequests();
		incomingRequests.value = {
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
		callback(incomingRequests.value.requests);
	} else {
		const filteredRequests = incomingRequests.value.requests.filter(request =>
			request.reagentName.toLowerCase().includes(queryString.toLowerCase())
		);
		return callback(filteredRequests);
	}
};

const linkRequest = selectedRequest => {
	const requestCopy = { ...selectedRequest };
	if (!linkedRequests.value.find(req => req.id === selectedRequest.id)) {
		linkedRequests.value.push(selectedRequest);
		form.value.reagentRequests.push(requestCopy);
	}
};
const removeLinkedRequest = request => {
	linkedRequests.value = linkedRequests.value.filter(r => r.id !== request.id);
	form.value.reagentRequests = form.value.reagentRequests.filter(r => r.id !== request.id);
};

function viewRequestDetails(request) {
	const target = $router.resolve({ name: 'request-details', params: { id: request.id } }).href;
	window.open(target, '_blank');
}
</script>

<template>
	<el-form-item v-if="props.isRequest" label="Linked Requests" class="requests" :rules="[]">
		<el-autocomplete
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
				closable
				@click="() => viewRequestDetails(request)"
				@close="() => removeLinkedRequest(request)"
			>
				{{ request.reagentName }} ({{ request.quantity }} {{ request.quantityUnit }})
			</el-tag>
		</div>
	</el-form-item>
</template>
