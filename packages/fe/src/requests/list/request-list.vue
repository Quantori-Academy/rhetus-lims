<script setup>
import { ElTable, ElTableColumn, ElButton } from 'element-plus';
import { onMounted, ref, watch } from 'vue';
import { debounce } from '../../lib/utils/debounce/debounce';
import { $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg';
import { $api } from '../../lib/api';
import { formatDate } from '../../lib/utils/datetime/date-format';
import RhFilters from '../../lib/components/rh-filters/rh-filters.vue';
import RequestsFilters from '../requests-filters.vue';

const isLoading = ref(false);
const requests = ref([]);
const filters = ref({
	reagentName: '',
	status: ''
});

const setRequests = debounce(async () => {
	isLoading.value = true;
	try {
		const data = await $api.requests.fetchRequests(filters.value);
		requests.value = data.requests;
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		isLoading.value = false;
	}
}, 200);

watch(
	filters,
	() => {
		setRequests();
	},
	{ deep: true }
);

onMounted(() => {
	setRequests();
});
</script>

<template>
	<div class="margin-table">
		<rh-filters>
			<template #action-buttons>
				<el-button type="primary">Create New Request</el-button>
			</template>
			<template #filters>
				<requests-filters v-model:filters="filters" />
			</template>
		</rh-filters>
		<el-table v-loading="isLoading" :data="requests">
			<el-table-column prop="reagentName" min-width="150" label="Reagent Name" />
			<el-table-column prop="structure" min-width="120" label="Structure" />
			<el-table-column prop="casNumber" min-width="150" label="CAS Number" />
			<el-table-column prop="quantity" label="Quantity" />
			<el-table-column prop="userComment" min-width="150" label="User comment" />
			<el-table-column prop="poComment" min-width="150" label="Procurement comment" />
			<el-table-column
				prop="createdAt"
				label="Creation Date"
				min-width="150"
				:formatter="data => formatDate(data.createdAt)"
			/>
			<el-table-column
				prop="updatedAt"
				label="Update Date"
				min-width="150"
				:formatter="data => formatDate(data.updatedAt)"
			/>
			<el-table-column prop="status" min-width="120" label="Status" />
		</el-table>
	</div>
</template>
