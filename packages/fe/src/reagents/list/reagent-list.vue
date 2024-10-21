<script setup>
import RhIcon from '../../lib/components/rh-icon.vue';
import { ref, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElButton } from 'element-plus';
import { $router } from '../../lib/router/router.js';
import { $api } from '../../lib/api/index.js';
import { $confirm } from '../../lib/utils/feedback/confirm-msg';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import RhFilters from '../../lib/components/rh-filters/rh-filters.vue';
import SubstanceFilters from '../substance-filters.vue';

const reagents = ref(null);
const isLoading = ref(false);

function addNewReagent() {
	$router.push({ name: 'new-reagent' });
}
function addNewSample() {
	$router.push({ name: 'new-sample' });
}

function editSubstance(row) {
	$router.push({
		name: row.category.toLowerCase() === 'reagent' ? 'reagent-details-edit' : 'edit-sample',
		params: { id: row.id }
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
		return await $confirm('Do you want to delete this item?', 'Warning', {
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel',
			type: 'warning'
		});
	} catch {
		showNotification('Canceled', 'Item deletion canceled', 'info');
		return false;
	}
};
const deleteSubstance = async row => {
	if (!(await confirmDeleteReagent())) return;
	try {
		if (row.category.toLowerCase() === 'reagent') {
			await $api.reagents.deleteReagent(row.id);
		} else {
			await $api.samples.deleteSample(row.id);
		}
		showNotification('Success', 'Item is deleted', 'success');
		await setReagents();
	} catch (error) {
		showNotification('Error', error.message || 'Item update canceled', 'error');
	}
};

async function setReagents(event = null) {
	isLoading.value = true;
	let query = createQuery(event);
	try {
		const response = await $api.substances.fetchSubstances(query);
		reagents.value = response.substances;
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		isLoading.value = false;
	}
}

function createQuery(event) {
	let query = {};
	if (event && event.prop && event.order) {
		const order = event.order === 'ascending' ? 'desc' : 'asc';
		query.sort = { [event.prop]: order };
	}
	return query;
}

onMounted(() => {
	setReagents();
});
</script>

<template>
	<div class="reagent-table">
		<rh-filters>
			<template #action-buttons>
				<el-button type="primary" @click="addNewReagent">Add New Reagent</el-button>
				<el-button type="primary" @click="addNewSample">Add New Sample</el-button>
			</template>

			<template #filters>
				<substance-filters />
			</template>
		</rh-filters>

		<el-table
			v-loading="isLoading"
			:data="reagents"
			@row-click="viewSubstance"
			@sort-change="setReagents"
		>
			<el-table-column prop="name" min-width="150" label="Name" sortable />
			<el-table-column prop="category" min-width="150" label="Category" sortable />
			<el-table-column prop="structure" min-width="200" label="Structure" />
			<el-table-column prop="description" min-width="200" label="Description" />
			<el-table-column prop="quantityLeft" min-width="80" label="Quantity Left" />
			<el-table-column prop="storageLocationId" min-width="80" label="Storage Location" />
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
						<rh-icon color="white" name="trash" />
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<style scoped>
.reagent-table {
	margin-top: 20px;
}

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
