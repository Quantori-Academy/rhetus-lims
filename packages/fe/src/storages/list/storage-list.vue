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
import { __ } from '../../lib/locales/index.js';

const storages = ref([]);
const isLoading = ref(false);
const filters = ref({
	room: '',
	name: ''
});
const sortData = ref({});
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

const setStorages = debounce(async () => {
	isLoading.value = true;
	const params = {
		...paginationData.value,
		sort: sortData.value,
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

const handleSortChange = event => {
	const isDescending = event.order === 'descending';

	sortData.value = { [event.prop]: isDescending ? 'desc' : 'asc' };

	setStorages();
};
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
					{{ __('Add New Storage Location') }}
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
			@sort-change="handleSortChange"
		>
			<el-table-column prop="room" min-width="150" :label="__('Room')" sortable />
			<el-table-column prop="name" min-width="150" :label="__('Name')" sortable />
			<el-table-column prop="description" min-width="200" :label="__('Description')" />
			<el-table-column
				prop="creationDate"
				min-width="200"
				:label="__('Creation Date')"
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
						:content="__(`Can't delete, storage is not empty.`)"
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
