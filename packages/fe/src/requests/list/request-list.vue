<script setup>
import { ElTable, ElTableColumn, ElButton, ElMessageBox } from 'element-plus';
import { inject, onMounted, ref, watch } from 'vue';
import { debounce } from '../../lib/utils/debounce/debounce';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg';
import { $api } from '../../lib/api';
import { formatDate } from '../../lib/utils/datetime/date-format';
import RhFilters from '../../lib/components/rh-filters/rh-filters.vue';
import RequestsFilters from '../requests-filters.vue';
import { $router } from '../../lib/router/router';
import RhPagination from '../../lib/components/rh-pagination/rh-pagination.vue';
import { $confirm } from '../../lib/utils/feedback/confirm-msg';

const isLoading = ref(false);
const requests = ref([]);
const sort = ref(null);
const user = inject('user');
const filters = ref({
	reagentName: '',
	status: '',
	creationRange: [],
	updateRange: []
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
		const data = await $api.requests.fetchRequests(params);
		if (user.isResearcher) {
			requests.value = data.requests.filter(request => request.author.id === user.user.value.id);
		} else {
			requests.value = data.requests;
		}
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
};
watch(paginationData.value, () => setRequests());
const addNewRequest = () => {
	$router.push({ name: 'new-request' });
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
				<el-button type="primary" @click="addNewRequest">Create New Request</el-button>
			</template>
			<template #filters>
				<requests-filters v-model:filters="filters" />
			</template>
		</rh-filters>
		<el-table v-loading="isLoading" :data="requests" @sort-change="setRequests">
			<el-table-column prop="status" min-width="100" label="Status" sortable />
			<el-table-column prop="reagentName" min-width="120" label="Reagent Name" sortable />
			<el-table-column prop="quantity" label="Quantity" sortable />
			<el-table-column prop="quantityUnit" min-width="120" label="Quantity Unit" sortable />
			<el-table-column prop="amount" label="Amount" sortable />
			<el-table-column prop="userComment" min-width="120" label="User comment" sortable />
			<el-table-column
				prop="createdAt"
				label="Creation Date"
				min-width="120"
				:formatter="data => formatDate(data.createdAt)"
				sortable
			/>
			<el-table-column
				prop="updatedAt"
				label="Update Date"
				min-width="120"
				:formatter="data => formatDate(data.updatedAt)"
				sortable
			/>
			<el-table-column v-if="user.user.value.role.name === 'procurement officer'" width="100">
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
		<rh-pagination :pagination="paginationData" @change-page="handlePageChange" />
	</div>
</template>
