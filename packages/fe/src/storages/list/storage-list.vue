<script setup>
import { ref, onMounted, watch } from 'vue';
import { ElTable, ElTableColumn, ElButton, ElTooltip } from 'element-plus';
import RhIcon from '../../lib/components/rh-icon.vue';
import { $api } from '../../lib/api/index.js';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $router } from '../../lib/router/router.js';
import { $confirm } from '../../lib/utils/feedback/confirm-msg.js';
import RhFilters from '../../lib/components/rh-filters/rh-filters.vue';
import StorageFilters from '../storage-filters.vue';
import { formatDate } from '../../lib/utils/datetime/date-format.js';
import { debounce } from '../../lib/utils/debounce/debounce.js';
import RhPagination from '../../lib/components/rh-pagination/rh-pagination.vue';

const storages = ref([]);
const isLoading = ref(false);
const filters = ref({
	room: '',
	name: ''
});
const sort = ref(null);
function addNewStorageLocation() {
	$router.push({ name: 'new-storage' });
}

function viewStorageLocation(row) {
	$router.push({ name: 'storage-details', params: { id: row.id } });
}
function editStorageLocation(id) {
	$router.push({ name: 'storage-details-edit', params: { id } });
}

async function deleteStorageLocation(id) {
	try {
		await $confirm(
			'Are you sure you want to delete this storage location?',
			'Please, confirm your action',
			{
				confirmButtonText: 'Delete',
				cancelButtonText: 'Cancel',
				type: 'warning'
			}
		);
		try {
			const response = await $api.storages.deleteStorage(id);
			$notify({
				title: 'Success',
				message: response.message,
				type: 'success'
			});
			await setStorages();
		} catch (err) {
			$notifyUserAboutError(err);
		}
	} catch (error) {
		if (!['cancel', 'close'].includes(error)) {
			this.$notifyUserAboutError(error);
		}
	}
}

const setStorages = debounce(async (event = null) => {
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
		const { storages: storagesData, count } = await $api.storages.fetchStoragesWithCount(params);
		storages.value = storagesData;
		paginationData.value.totalElements = count;
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

watch(paginationData.value, () => setStorages());

watch(
	filters,
	() => {
		setStorages();
	},
	{ deep: true }
);

onMounted(() => {
	setStorages();
});
</script>

<template>
	<div class="margin-table">
		<rh-filters>
			<template #action-buttons>
				<el-button type="primary" @click="addNewStorageLocation">
					Add New Storage Location
				</el-button>
			</template>

			<template #filters>
				<storage-filters v-model:filters="filters" />
			</template>
		</rh-filters>

		<el-table
			v-loading="isLoading"
			:data="storages"
			@row-click="viewStorageLocation"
			@sort-change="setStorages"
		>
			<el-table-column prop="room" min-width="150" label="Room" />
			<el-table-column prop="name" min-width="150" label="Name" />
			<el-table-column prop="description" min-width="200" label="Description" />
			<el-table-column
				prop="creationDate"
				min-width="200"
				label="Creation Date"
				width="140"
				:formatter="data => formatDate(data.creationDate)"
				sortable
			/>
			<el-table-column width="80">
				<template #default="{ row }">
					<el-button @click.stop="() => editStorageLocation(row.id)"
						><rh-icon name="pencil"
					/></el-button>
				</template>
			</el-table-column>
			<el-table-column width="80">
				<template #default="{ row }">
					<el-tooltip
						:disabled="row.isEmpty"
						content="Can't delete, storage is not empty."
						placement="top"
					>
						<el-button
							type="danger"
							:disabled="!row.isEmpty"
							@click.stop="() => deleteStorageLocation(row.id)"
						>
							<rh-icon color="white" name="remove" />
						</el-button>
					</el-tooltip>
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
