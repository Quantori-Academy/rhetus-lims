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

const props = defineProps({
	id: {
		type: String,
		default: null
	}
});

const filters = ref({
	name: '',
	quantity: null
});

const substances = ref([]);
const storages = ref([]);
const isLoading = ref(false);
const paginationData = ref({
	page: 1,
	size: 10,
	totalElements: 0
});

async function setSubstances(id) {
	isLoading.value = true;
	try {
		const params = {
			options: { location: id, ...filters.value },
			page: paginationData.value.page,
			limit: paginationData.value.size
		};
		const data = await $api.substances.fetchSubstances(params);

		substances.value = data.substances;
		paginationData.value.totalElements = data.count;
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error viewing substances content');
	} finally {
		isLoading.value = false;
	}
}

async function fetchStorages() {
	isLoading.value = true;
	try {
		const data = await $api.storages.fetchStorages();
		storages.value = data.storages;
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

		if (row.category.toLowerCase() === 'reagent') {
			await $api.reagents.deleteReagent(row.id);
		} else {
			await $api.samples.deleteSample(row.id);
		}
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

watch(
	filters,
	() => {
		setSubstances(props.id);
	},
	{ deep: true }
);

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
		<el-table :data="substances" @row-click="viewSubstance">
			<el-table-column width="50">
				<template #default="{ row }">
					<rh-icon
						color="#1785be"
						:name="row.category.toLowerCase() === 'reagent' ? 'pod' : 'applications'"
					/>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="Name" />
			<el-table-column prop="category" label="Category" />
			<el-table-column prop="structure" label="Structure" />
			<el-table-column prop="description" label="Description" />
			<el-table-column prop="quantityLeft" label="Quantity Left" />
			<el-table-column width="380" label="Storage Location">
				<template #default="{ row }">
					<el-select
						v-model="row.storageLocationId"
						class="custom-select"
						placeholder="Please select a storage"
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
