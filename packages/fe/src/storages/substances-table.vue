<script setup>
import { onMounted, ref, watch } from 'vue';
import RhIcon from '../lib/components/rh-icon.vue';
import { ElTable, ElTableColumn, ElButton, ElSelect, ElOption } from 'element-plus';
import { $api } from '../lib/api/index';
import { $confirm } from '../lib/utils/feedback/confirm-msg';
import { $notify, $notifyUserAboutError } from '../lib/utils/feedback/notify-msg.js';
import { $router } from '../lib/router/router.js';
import RhFilters from '../lib/components/rh-filters/rh-filters.vue';
import RhPagination from '../lib/components/rh-pagination/rh-pagination.vue';
import SubstanceFilters from '../substances/substance-filters.vue';
import { __ } from '../lib/locales/index.js';
import { debounce } from '../lib/utils/debounce/debounce.js';

const props = defineProps({
	id: {
		type: String,
		default: null
	}
});

const filters = ref({
	name: '',
	expired: false,
	smiles: ''
});
const sortData = ref({});
const substances = ref([]);
const storages = ref([]);
const isLoading = ref(false);
const paginationData = ref({
	page: 1,
	size: 10,
	totalElements: 0
});
const setSubstances = debounce(async id => {
	isLoading.value = true;
	const { expired, ...rest } = filters.value;
	if (filters.value.smiles) {
		sortData.value = { ...sortData.value, relevance: 'desc' };
	}
	const params = {
		...paginationData.value,
		sort: sortData.value,
		options: {
			...rest,
			expirationDate: expired ? [new Date('0001-01-01T00:00:00.000Z'), new Date()] : [],
			location: id
		}
	};
	try {
		const { substances: substancesData, count } = await $api.substances.fetchSubstances(params);
		substances.value = substancesData;
		paginationData.value.totalElements = count;
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error viewing substances content');
	} finally {
		isLoading.value = false;
	}
}, 200);

async function fetchStorages() {
	isLoading.value = true;
	try {
		storages.value = await $api.storages.fetchStorages();
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error getting storage locations');
	} finally {
		isLoading.value = false;
	}
}

const editSubstance = row => {
	$router.push({
		name: row.category.toLowerCase() === 'reagent' ? 'reagent-details-edit' : 'edit-sample',
		params: { id: row.id }
	});
};

const viewSubstance = row => {
	$router.push({ name: 'reagent-details', params: { id: row.id } });
};

const deleteSubstance = async row => {
	try {
		await $confirm('Do you want to delete this item?', 'Warning', {
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel',
			type: 'warning'
		});
		await $api.substances.deleteSubstance(row.category.toLowerCase(), row.id);
		$notify({
			title: 'Success',
			message: 'Item is deleted',
			type: 'success'
		});
		await setSubstances(props.id);
	} catch (error) {
		if (['cancel', 'close'].includes(error)) {
			$notify({
				title: 'Canceled',
				message: 'Deletion canceled',
				type: 'info'
			});
		} else {
			$notifyUserAboutError(error.message || 'Substance delete canceled');
		}
	}
};

const changeStorage = async row => {
	try {
		await $confirm('Do you want to move this substance?', 'Warning', {
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel',
			type: 'warning'
		});
		const response = await $api.substances.updateSubstance(row.id, {
			storageId: row.storageLocationId,
			category: row.category
		});
		$notify({
			title: 'Success',
			message: response.message,
			type: 'success'
		});
	} catch (error) {
		if (['cancel', 'close'].includes(error)) {
			$notify({
				title: 'Canceled',
				message: 'Storage update was canceled',
				type: 'info'
			});
		} else {
			$notifyUserAboutError(error.message || 'Storage update canceled');
		}
	} finally {
		setSubstances(props.id);
	}
};

const handlePageChange = newPage => {
	paginationData.value.page = newPage;
	setSubstances(props.id);
};
const handleSortChange = event => {
	const isDescending = event.order === 'descending';
	sortData.value = { [event.prop]: isDescending ? 'desc' : 'asc' };
	setSubstances();
};
watch(filters, () => setSubstances(props.id), { deep: true });

onMounted(() => {
	setSubstances(props.id);
	fetchStorages();
});
</script>

<template>
	<div v-loading="isLoading">
		<rh-filters>
			<template #filters>
				<substance-filters v-model:filters="filters" />
			</template>
		</rh-filters>
		<el-table :data="substances" @row-click="viewSubstance" @sort-change="handleSortChange">
			<el-table-column width="50">
				<template #default="{ row }">
					<rh-icon
						color="#1785be"
						:name="row.category.toLowerCase() === 'reagent' ? 'pod' : 'applications'"
					/>
				</template>
			</el-table-column>
			<el-table-column prop="name" :label="__('Name')" sortable />
			<el-table-column prop="category" :label="__('Category')" sortable />
			<el-table-column prop="structure" :label="__('Structure')" sortable />
			<el-table-column prop="description" :label="__('Description')" />
			<el-table-column prop="quantityLeft" :label="__('Quantity left')">
				<template #default="{ row }">{{ row.quantityLeft }} {{ row.quantityUnit }}</template>
			</el-table-column>
			<el-table-column width="380" :label="__('Storage location')">
				<template #default="{ row }">
					<el-select
						v-model="row.storageLocationId"
						class="custom-select"
						:placeholder="__('Please select a storage')"
						@click.stop
						@change="() => changeStorage(row)"
					>
						<el-option
							v-for="storageItem of storages"
							:key="storageItem.id"
							:label="`${storageItem.room} - ${storageItem.name}`"
							:value="storageItem.id"
						/>
					</el-select>
				</template>
			</el-table-column>
			<el-table-column width="80">
				<template #default="{ row }">
					<el-button @click.stop="() => editSubstance(row)">
						<rh-icon name="pencil" />
					</el-button>
				</template>
			</el-table-column>
			<el-table-column width="80">
				<template #default="{ row }">
					<el-button type="danger" @click.stop="() => deleteSubstance(row)">
						<rh-icon color="white" name="remove" />
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<rh-pagination :pagination="paginationData" @change-page="handlePageChange" />
	</div>
</template>

<style scoped>
:deep(.el-select__wrapper) {
	width: 350px;
}

:deep(.el-table__header-wrapper .cell) {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 1px;
}
:deep(.el-table__header-wrapper .cell .el-button) {
	margin-left: 0;
	width: 1rem;
	height: 1rem;
	border: none;
}

:deep(.el-table__row):hover {
	cursor: pointer;
}
</style>
