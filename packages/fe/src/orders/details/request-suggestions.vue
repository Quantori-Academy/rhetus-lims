<script setup>
import { ref } from 'vue';
import { ElAutocomplete, ElFormItem } from 'element-plus';
import { __ } from '../../lib/locales/index.js';

const props = defineProps({
	order: { type: Object, default: null },
	isEdit: { type: Boolean, default: false },
	suggestedRequests: { type: Object, default: null },
	linkedRequests: { type: Object, default: null }
});
const searchQuery = ref('');
const emit = defineEmits(['set-order', 'link-request']);

const fetchRequestSuggestions = async (queryString, callback) => {
	if (!queryString) {
		callback(
			props.suggestedRequests.requests.filter(
				req => !props.linkedRequests.find(linked => linked.id === req.id)
			)
		);
	} else {
		const filteredRequests = props.suggestedRequests.requests.filter(request =>
			request.reagentName.toLowerCase().includes(queryString.toLowerCase())
		);

		const suggestions = filteredRequests.filter(
			req => !props.linkedRequests.find(linked => linked.id === req.id)
		);

		callback(suggestions);
	}
};

const linkRequest = async selectedRequest => {
	const alreadyLinked = props.linkedRequests.find(req => req.tempId === selectedRequest.id);
	if (alreadyLinked) {
		return;
	}
	emit('link-request', selectedRequest);
};
</script>

<template>
	<el-form-item
		:label="props.linkedRequests.length > 0 && props.isEdit ? __('Linked Requests') : ''"
		class="requests"
		:rules="[]"
	>
		<el-autocomplete
			v-if="props.isEdit"
			v-model="searchQuery"
			:fetch-suggestions="fetchRequestSuggestions"
			clearable
			:placeholder="__('Search for requests')"
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
