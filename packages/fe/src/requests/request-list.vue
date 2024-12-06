<script setup>
import { ElTable, ElTableColumn, ElButton, ElMessageBox } from 'element-plus';
import { inject, onMounted, ref, watch } from 'vue';
import { debounce } from '../lib/utils/debounce/debounce';
import { $notify, $notifyUserAboutError } from '../lib/utils/feedback/notify-msg';
import { $api } from '../lib/api';
import { $router } from '../lib/router/router';
import { $confirm } from '../lib/utils/feedback/confirm-msg';
import { formatDate } from '../lib/utils/datetime/date-format';
import RhFilters from '../lib/components/rh-filters/rh-filters.vue';
import RequestsFilters from './requests-filters.vue';
import RhPagination from '../lib/components/rh-pagination/rh-pagination.vue';
import { __ } from '../lib/locales';

const isLoading = ref(false);
const requests = ref([]);
const sort = ref(null);
const user = inject('user');
const filters = ref({
	reagentName: '',
	status: '',
	createdAt: [],
	updatedAt: []
});
function createQuery(event) {
	let query = {};
	if (event && event.prop && event.order) {
		const order = event.order === 'ascending' ? 'asc' : 'desc';
		query = { [event.prop]: order };
	}
	return query;
}
const setRequests = debounce(async (event = null) => {
	isLoading.value = true;
	if (event) {
		const sortQuery = createQuery(event);
		sort.value = sortQuery;
	}
	const params = {
		page: paginationData.value.page,
		limit: paginationData.value.size,
		sort: sort.value,
		options: { ...filters.value }
	};
	try {
		const { requests: requestsData, count } = await $api.requests.fetchRequests(params);
		requests.value = requestsData;
		paginationData.value.totalElements = count;
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		isLoading.value = false;
	}
}, 200);
const cancelRequest = async id => {
	try {
		await $confirm('Are you sure you want to cancel the request?', 'Please, confirm your action', {
			confirmButtonText: 'Yes',
			cancelButtonText: 'No',
			type: 'warning'
		});
		await ElMessageBox.prompt('Please, provide a reason', 'Warning', {
			confirmButtonText: 'Ok',
			cancelButtonText: 'Cancel',
			inputPattern: /\S+/,
			inputErrorMessage: 'Reason is required'
		}).then(({ value }) => {
			const response = $api.requests.cancelRequest(id, { reason: value });
			$notify({
				title: 'Success',
				message: response.message,
				type: 'success'
			});
			setRequests();
		});
	} catch (error) {
		if (!['cancel', 'close'].includes(error)) {
			this.$notifyUserAboutError(error);
		}
	}
};
const paginationData = ref({
	page: 1,
	size: 10,
	totalElements: 0
});
const handlePageChange = newPage => {
	paginationData.value.page = newPage;
	setRequests();
};

const addNewRequest = () => {
	$router.push({ name: 'new-request' });
};

function viewRequestDetails(row) {
	$router.push({ name: 'request-details', params: { id: row.id } });
}
watch(filters, () => setRequests(), { deep: true });
onMounted(() => {
	setRequests();
});
</script>

<template>
	<div class="margin-table">
		<rh-filters>
			<template #action-buttons>
				<el-button type="primary" @click="addNewRequest">{{ __('Create New Request') }}</el-button>
			</template>
			<template #filters>
				<requests-filters v-model:filters="filters" />
			</template>
		</rh-filters>
		<el-table
			v-loading="isLoading"
			:data="requests"
			@sort-change="setRequests"
			@row-click="viewRequestDetails"
		>
			<el-table-column prop="status" width="100" :label="__('Status')" sortable />
			<el-table-column prop="reagentName" min-width="120" :label="__('Reagent name')" sortable />
			<el-table-column prop="quantity" :label="__('Quantity')" sortable>
				<template #default="{ row }"> {{ row.quantity }} {{ row.quantityUnit }} </template>
			</el-table-column>
			<el-table-column prop="amount" :label="__('Amount')" sortable />
			<el-table-column prop="author.username" :label="__('Created by')" sortable />
			<el-table-column
				prop="createdAt"
				:label="__('Creation Date')"
				:formatter="data => formatDate(data.createdAt)"
				sortable
			/>
			<el-table-column
				prop="updatedAt"
				:label="__('Update Date')"
				:formatter="data => formatDate(data.updatedAt)"
				sortable
			/>
			<el-table-column v-if="user?.user?.value?.role.name === 'procurement officer'" width="110">
				<template #default="{ row }">
					<el-button
						type="danger"
						:disabled="row.status !== 'pending'"
						@click.stop="() => cancelRequest(row.id)"
					>
						{{ __('Cancel') }}
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<rh-pagination :pagination="paginationData" @change-page="handlePageChange" />
	</div>
</template>

<style scoped>
:deep(.el-table__row):hover {
	cursor: pointer;
}
</style>
