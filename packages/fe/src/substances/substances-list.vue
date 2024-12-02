<script setup>
import { ref, onMounted, watch, inject } from 'vue';
import { ElTable, ElTableColumn, ElButton } from 'element-plus';
import { $router } from '../lib/router/router.js';
import { $api } from '../lib/api/index.js';
import { $confirm } from '../lib/utils/feedback/confirm-msg.js';
import { $notify, $notifyUserAboutError } from '../lib/utils/feedback/notify-msg.js';
import RhPagination from '../lib/components/rh-pagination/rh-pagination.vue';
import RhFilters from '../lib/components/rh-filters/rh-filters.vue';
import SubstanceFilters from './substance-filters.vue';
import { debounce } from '../lib/utils/debounce/debounce.js';
import { __ } from '../lib/locales/index.js';
import RhIcon from '../lib/components/rh-icon.vue';

const { isOfficer } = inject('user');
const substances = ref([]);
const sort = ref(null);
const isLoading = ref(false);
const filters = ref({
	name: '',
	quantity: null,
	expired: false,
	smiles: ''
});

const paginationData = ref({
	page: 1,
	size: 10,
	totalElements: 0
});

const handlePageChange = newPage => {
	paginationData.value.page = newPage;
};
function addNewReagent() {
	$router.push({ name: 'new-reagent' });
}
function addNewSample() {
	$router.push({ name: 'new-sample' });
}
function orderReagent(row) {
	$router.push({
		name: 'new-order-substance',
		query: { id: row.id }
	});
}

function viewSubstance(row) {
	$router.push({
		name: row.category.toLowerCase() === 'reagent' ? 'reagent-details' : 'sample-details',
		params: { id: row.id }
	});
}
const showNotification = (title, message, type) => {
	$notify({ title, message, type });
};
const confirmDeleteReagent = async () => {
	try {
		return await $confirm(__('Do you want to delete this item?'), __('Warning'), {
			confirmButtonText: __('OK'),
			cancelButtonText: __('Cancel'),
			type: 'warning'
		});
	} catch (error) {
		if (!['cancel', 'close'].includes(error)) {
			this.$notifyUserAboutError(error);
		}
		return false;
	}
};

const deleteSingleSubstance = async row => {
	if (!(await confirmDeleteReagent())) return;
	try {
		await $api.substances.deleteSubstance(row.category.toLowerCase(), row.id);
		showNotification(__('Success'), __('Item is deleted'), 'success');
		await setSubstances();
	} catch (error) {
		showNotification(__('Error'), error.message || __('Item update canceled'), 'error');
	}
};

const addStructureSort = sortQuery => {
	if (filters.value.smiles) {
		sortQuery.sort = { ...(sortQuery.sort ?? {}), relevance: 'desc' };
	}
};

const setSubstances = debounce(async (event = null) => {
	isLoading.value = true;
	if (event) {
		const sortQuery = createQuery(event);
		sort.value = sortQuery;
		addStructureSort(sortQuery);
	}
	const { expired, ...rest } = filters.value;
	const params = {
		page: paginationData.value.page,
		limit: paginationData.value.size,
		sort: sort.value,
		options: {
			...rest,
			expirationDate: expired ? [new Date('0001-01-01T00:00:00.000Z'), new Date()] : []
		}
	};
	try {
		const { substances: substancesData, count } = await $api.substances.fetchSubstances(params);
		substances.value = substancesData;
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
const handleSortChange = event => {
	const sortQuery = createQuery(event);
	sort.value = sortQuery;
	setSubstances(event);
};

watch(paginationData.value, () => setSubstances());
watch(
	filters,
	() => {
		setSubstances();
	},
	{ deep: true }
);
onMounted(() => {
	setSubstances();
});
</script>

<template>
	<div class="margin-table">
		<rh-filters>
			<template #action-buttons>
				<el-button type="primary" @click="addNewReagent">
					<rh-icon color="#7dcdea" name="pod" class="icon" />{{ __('Add New Reagent') }}
				</el-button>
				<el-button type="primary" @click="addNewSample">
					<rh-icon color="#7DCDEA" name="applications" class="icon" />{{ __('Add New Sample') }}
				</el-button>
			</template>

			<template #filters>
				<substance-filters v-model:filters="filters" />
			</template>
		</rh-filters>

		<el-table
			v-loading="isLoading"
			:data="substances"
			@row-click="viewSubstance"
			@sort-change="handleSortChange"
		>
			<el-table-column width="50">
				<template #default="{ row }">
					<rh-icon
						color="#1785be"
						:name="row.category.toLowerCase() === 'reagent' ? 'pod' : 'applications'"
					/>
				</template>
			</el-table-column>
			<el-table-column prop="name" min-width="150" :label="__('Name')" sortable />
			<el-table-column prop="category" min-width="120" :label="__('Category')" sortable />
			<el-table-column prop="structure" min-width="120" :label="__('Structure')" sortable />
			<el-table-column prop="description" min-width="160" :label="__('Description')" />
			<el-table-column prop="quantityLeft" min-width="120" :label="__('Quantity left')">
				<template #default="{ row }">{{ row.quantityLeft }} {{ row.quantityUnit }}</template>
			</el-table-column>
			<el-table-column prop="storageLocation" min-width="140" :label="__('Storage location')">
				<template #default="{ row }"
					>{{ row.storageLocation?.name }} {{ row.storageLocation?.room }}</template
				>
			</el-table-column>
			<el-table-column v-if="isOfficer" width="60">
				<template #default="{ row }">
					<el-button type="primary" @click.stop="() => orderReagent(row)">
						<rh-icon color="white" name="file-addition" />
					</el-button>
				</template>
			</el-table-column>
			<el-table-column width="60">
				<template #default="{ row }">
					<el-button type="danger" @click.stop="() => deleteSingleSubstance(row)">
						<rh-icon color="white" name="remove" />
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<rh-pagination :pagination="paginationData" @change-page="handlePageChange" />
	</div>
</template>

<style scoped>
.top-buttons {
	margin-bottom: 10px;
}

.reagent__action-buttons {
	display: flex;
	flex-direction: row;
}

::v-deep .el-table__header-wrapper .cell {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 1px;
}
::v-deep .el-table__header-wrapper .cell .el-button {
	margin-left: 0;
	width: 1rem;
	height: 1rem;
	border: none;
}
:deep(.el-table__row):hover {
	cursor: pointer;
}
</style>
