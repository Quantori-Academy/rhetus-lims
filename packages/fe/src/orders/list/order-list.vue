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

const orders = ref([]);
const isLoading = ref(false);
const sort = ref(null);
const filters = ref({
	title: '',
	status: '',
	createdAt: [],
	updatedAt: []
});

function addNewOrder() {
	$router.push({ name: 'new-order' });
}
function viewOrder(row) {
	$router.push({ name: 'order-details', params: { id: row.id } });
}
function editOrder(id) {
	$router.push({ name: 'order-details-edit', params: { id } });
}
async function deleteOrder(id) {
	try {
		await $confirm('Are you sure you want to delete this order?', 'Please, confirm your action', {
			confirmButtonText: 'Delete',
			cancelButtonText: 'Cancel',
			type: 'warning'
		});
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

const setOrders = debounce(async (event = null) => {
	isLoading.value = true;
	if (event) {
		const sortQuery = createQuery(event);
		sort.value = sortQuery;
	}
	const params = {
		page: paginationData.value.page,
		limit: paginationData.value.size,
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

function createQuery(event) {
	let query = {};
	if (event && event.prop && event.order) {
		const order = event.order === 'ascending' ? 'asc' : 'desc';
		query = { [event.prop]: order };
	}
	return query;
}
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
				<el-button type="primary" @click="addNewOrder">Add New Order </el-button>
			</template>
			<template #filters>
				<order-filters v-model:filters="filters" />
			</template>
		</rh-filters>
		<el-table v-loading="isLoading" :data="orders" @row-click="viewOrder" @sort-change="setOrders">
			<el-table-column prop="status" min-width="150" label="Status" sortable />
			<el-table-column prop="title" min-width="150" label="Title" sortable />
			<el-table-column
				prop="createdAt"
				min-width="200"
				label="Created at"
				width="140"
				:formatter="data => formatDate(data.createdAt)"
				sortable
			/>
			<el-table-column
				prop="updatedAt"
				min-width="200"
				label="Updated at"
				width="140"
				:formatter="data => formatDate(data.updatedAt)"
				sortable
			/>
			<el-table-column prop="seller" min-width="150" label="Seller" sortable />
			<el-table-column width="80">
				<template #default="{ row }">
					<el-button @click.stop="() => editOrder(row.id)"><rh-icon name="pencil" /></el-button>
				</template>
			</el-table-column>
			<el-table-column width="80">
				<template #default="{ row }">
					<el-button type="danger" @click.stop="() => deleteOrder(row.id)">
						<rh-icon color="white" name="trash" />
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
