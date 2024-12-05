<script setup>
import { ref, onMounted, watch } from 'vue';
import { ElTable, ElTableColumn, ElButton } from 'element-plus';
import RhIcon from '../../lib/components/rh-icon.vue';
import { $api } from '../../lib/api/index.js';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $router } from '../../lib/router/router.js';
import { $confirm } from '../../lib/utils/feedback/confirm-msg.js';
import RhFilters from '../../lib/components/rh-filters/rh-filters.vue';
import OrderFilters from '../order-filters.vue';
import { formatDate } from '../../lib/utils/datetime/date-format.js';
import { debounce } from '../../lib/utils/debounce/debounce.js';
import RhPagination from '../../lib/components/rh-pagination/rh-pagination.vue';
import { Statuses } from './constants.js';
import { __ } from '../../lib/locales/index.js';

const orders = ref([]);
const isLoading = ref(false);
const sort = ref(null);
const filters = ref({
	title: '',
	status: '',
	createdAt: [],
	updatedAt: []
});

function isPending(status) {
	return status === Statuses.PENDING;
}

function addNewOrder() {
	$router.push({ name: 'new-order-request' });
}

function viewOrder(row) {
	$router.push({ name: 'order-details', params: { id: row.id } });
}
function editOrder(id) {
	$router.push({ name: 'order-details-edit', params: { id } });
}
async function deleteOrder(id) {
	try {
		await $confirm(
			__('Are you sure you want to delete this order?'),
			__('Please, confirm your action'),
			{
				confirmButtonText: 'Delete',
				cancelButtonText: 'Cancel',
				type: 'warning'
			}
		);
		const response = await $api.orders.deleteOrder(id);
		$notify({
			title: 'Success',
			message: response.message,
			type: 'success'
		});
		setOrders();
	} catch (err) {
		if (!['cancel', 'close'].includes(err)) {
			$notifyUserAboutError(err);
		}
	}
}

const setOrders = debounce(async () => {
	isLoading.value = true;
	const params = {
		...paginationData.value,
		sort: sort.value,
		options: {
			...filters.value
		}
	};
	try {
		const data = await $api.orders.fetchOrders(params);
		orders.value = data.orders;
		paginationData.value.totalElements = data.count;
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		isLoading.value = false;
	}
}, 200);

const handleSortChange = event => {
	const isDescending = event.order === 'descending';
	sort.value = { [event.prop]: isDescending ? 'desc' : 'asc' };
	setOrders();
};
const paginationData = ref({
	page: 1,
	size: 10,
	totalElements: 0
});

const handlePageChange = newPage => {
	paginationData.value.page = newPage;
};

watch(paginationData.value, () => setOrders());

watch(
	filters,
	() => {
		setOrders();
	},
	{ deep: true }
);

onMounted(() => {
	setOrders();
});
</script>

<template>
	<div class="orders-table">
		<rh-filters>
			<template #action-buttons>
				<el-button type="primary" @click="addNewOrder">{{ __('Add New Order') }}</el-button>
			</template>
			<template #filters>
				<order-filters v-model:filters="filters" />
			</template>
		</rh-filters>
		<el-table
			v-loading="isLoading"
			:data="orders"
			@row-click="viewOrder"
			@sort-change="handleSortChange"
		>
			<el-table-column prop="status" min-width="150" :label="__('Status')" sortable />
			<el-table-column prop="title" min-width="150" :label="__('Title')" sortable />
			<el-table-column
				prop="createdAt"
				min-width="200"
				:label="__('Created at')"
				width="140"
				:formatter="data => formatDate(data.createdAt)"
				sortable
			/>
			<el-table-column
				prop="updatedAt"
				min-width="200"
				:label="__('Updated at')"
				width="140"
				:formatter="data => formatDate(data.updatedAt)"
				sortable
			/>
			<el-table-column prop="seller" min-width="150" :label="__('Seller')" sortable />
			<el-table-column width="80">
				<template #default="{ row }">
					<el-button :disabled="!isPending(row.status)" @click.stop="() => editOrder(row.id)"
						><rh-icon name="pencil"
					/></el-button>
				</template>
			</el-table-column>
			<el-table-column width="80">
				<template #default="{ row }">
					<el-button
						type="danger"
						:disabled="!isPending(row.status)"
						@click.stop="() => deleteOrder(row.id)"
					>
						<rh-icon color="white" name="remove" />
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<rh-pagination :pagination="paginationData" @change-page="handlePageChange" />
	</div>
</template>

<style scoped>
.orders-table {
	margin-top: 20px;
}
:deep(.el-table__row):hover {
	cursor: pointer;
}
</style>
