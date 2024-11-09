<script setup>
import { ElTable, ElTableColumn, ElButton } from 'element-plus';
import { onMounted, ref, watch } from 'vue';
import { debounce } from '../../lib/utils/debounce/debounce';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg';
import { $api } from '../../lib/api';
import { formatDate } from '../../lib/utils/datetime/date-format';
import RhFilters from '../../lib/components/rh-filters/rh-filters.vue';
import RequestsFilters from '../requests-filters.vue';
import { $confirm } from '../../lib/utils/feedback/confirm-msg';

const isLoading = ref(false);
const requests = ref([]);
const filters = ref({
	reagentName: '',
	status: '',
	creationRange: '',
	updateRange: ''
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

const cancelRequest = async id => {
	try {
		await $confirm('Do you want to cancel this request?', 'Warning', {
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel',
			type: 'warning'
		});

		const response = await $api.requests.cancelRequest(id);
		$notify({
			title: 'Success',
			message: response.message,
			type: 'success'
		});
		setRequests();
	} catch (error) {
		if (!['cancel', 'close'].includes(error)) {
			this.$notifyUserAboutError(error);
		}
	}
};

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
			<el-table-column prop="reagentName" min-width="120" label="Reagent Name" />
			<el-table-column prop="casNumber" min-width="120" label="CAS Number" />
			<el-table-column prop="quantity" label="Quantity" />
			<el-table-column prop="userComment" min-width="120" label="User comment" />
			<el-table-column prop="poComment" min-width="120" label="Procurement comment" />
			<el-table-column
				prop="createdAt"
				label="Creation Date"
				min-width="120"
				:formatter="data => formatDate(data.createdAt)"
			/>
			<el-table-column
				prop="updatedAt"
				label="Update Date"
				min-width="120"
				:formatter="data => formatDate(data.updatedAt)"
			/>
			<el-table-column prop="status" min-width="100" label="Status" />
			<el-table-column width="100">
				<template #default="{ row }">
					<el-button
						type="danger"
						:disabled="row.status !== 'pending'"
						@click.stop="() => cancelRequest(row.id)"
					>
						Cancel
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>
