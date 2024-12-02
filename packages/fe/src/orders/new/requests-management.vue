<script setup>
import { ref } from 'vue';
import { ElAutocomplete, ElFormItem } from 'element-plus';
import RhIcon from '../../lib/components/rh-icon.vue';
const props = defineProps({
	form: { type: Object, default: null },
	isRequest: { type: Boolean, default: false }
});
const searchQuery = ref('');
const emit = defineEmits(['link-request', 'fetch-suggestions']);

const fetchRequestSuggestions = async (queryString, callback) => {
	emit('fetch-suggestions', queryString, callback);
};
const linkRequest = selectedRequest => {
	emit('link-request', selectedRequest);
};
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
				<div>
					<rh-icon color="#1785be" name="pod" />
					{{ item.reagentName }}: {{ item.quantity }}{{ item.quantityUnit }} | Amount:
					{{ item.amount }}
				</div>
			</template>
		</el-autocomplete>
	</el-form-item>
</template>
