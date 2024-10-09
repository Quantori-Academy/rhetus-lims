<script setup>
import { ref, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElButton } from 'element-plus';
import RhIcon from '../../lib/components/rh-icon.vue';
import { $router } from '../../lib/router/router.js';
import { $api } from '../../lib/api/index.js';
import { $confirm } from '../../lib/utils/feedback/confirm-msg';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';

const reagents = ref(null);
const isLoading = ref(false);

function addNewReagent() {
	$router.push({ name: 'new-reagent' });
}
function addNewSample() {
	$router.push({ name: 'new-sample' });
}

function editReagent(id) {
	$router.push({ name: 'reagent-details', params: { id: id }, query: { isEdit: true } });
}

function viewReagent(row) {
	$router.push({ name: 'reagent-details', params: { id: row.id } });
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
const deleteReagent = async id => {
	if (!(await confirmDeleteReagent())) return;
	try {
		await $api.reagents.deleteReagent(id);
		showNotification('Success', 'Item is deleted', 'success');
		await setReagents();
	} catch (error) {
		showNotification('Error', error.message || 'Item update canceled', 'error');
	}
};

async function setReagents() {
	isLoading.value = true;
	try {
		reagents.value = await $api.reagents.fetchReagents();
	} catch (error) {
		$notifyUserAboutError(error);
	}

	isLoading.value = false;
}

onMounted(() => {
	setReagents();
});
</script>

<template>
	<div class="reagent-table">
		<el-button type="primary" @click="addNewReagent">Add New Reagent</el-button>
		<el-button type="primary" @click="addNewSample">Add New Sample</el-button>
		<el-table v-loading="isLoading" :data="reagents" @row-click="viewReagent">
			<el-table-column prop="name" label="Name" sortable />
			<el-table-column prop="category" label="Category" sortable />
			<el-table-column prop="structure" label="Structure" />
			<el-table-column prop="description" label="Description" />
			<el-table-column prop="quantityLeft" label="Quantity Left" />
			<el-table-column prop="storageLocation" label="Storage Location" />
			<el-table-column>
				<template #default="{ row }">
					<el-button @click="() => editReagent(row.id)"><rh-icon name="pencil" /></el-button>
					<el-button type="danger" @click="() => deleteReagent(row.id)">
						<rh-icon color="white" name="trash" />
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<style scoped>
.reagent-table {
	padding-left: 15rem;
	width: 90vw;
}
.reagent__action-buttons {
	display: flex;
	flex-direction: row;
}
:deep(.el-table__column) {
	width: max-content;
}

:deep(.el-table__cell) .cell:last-child {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	gap: 2px;
}
:deep(.el-table__row):hover {
	cursor: pointer;
}
</style>
