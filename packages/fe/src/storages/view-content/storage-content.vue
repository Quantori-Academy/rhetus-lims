<script setup>
import { onMounted, ref } from 'vue';
import RhIcon from '../../lib/components/rh-icon.vue';
import {
	ElTable,
	ElTableColumn,
	ElButton,
	ElDescriptions,
	ElDescriptionsItem,
	ElForm,
	ElFormItem,
	ElSelect,
	ElOption,
	ElDrawer
} from 'element-plus';
import { $api } from '../../lib/api/index';
import { $confirm } from '../../lib/utils/feedback/confirm-msg';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $router } from '../../lib/router/router.js';

const props = defineProps({
	id: {
		type: String,
		default: null
	}
});

const substances = ref(null);
const storage = ref(null);
const storages = ref(null);
const isLoading = ref(false);
const isFormVisible = ref(false);
const selectedStorageId = ref(null);
const selectedSubstance = ref(null);

async function setSubstances(id) {
	isLoading.value = true;
	try {
		const query = { options: { location: id } };
		const data = await $api.substances.fetchSubstances(query);

		substances.value = data.substances;
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error viewing substances content');
	} finally {
		isLoading.value = false;
	}
}

async function fetchStorage(id) {
	isLoading.value = true;
	try {
		const data = await $api.storages.fetchStorage(id);
		storage.value = data;
		selectedStorageId.value = data.id;
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error getting storage location');
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

const moveSubstance = row => {
	selectedSubstance.value = row;
	triggerModal();
};

const editSubstance = row => {
	$router.push({
		name: row.category.toLowerCase() === 'reagent' ? 'reagent-details-edit' : 'edit-sample',
		params: { id: row.id }
	});
};

const viewSubstance = row => {
	$router.push({ name: 'reagent-details', params: { id: row.id } });
};

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
		await setSubstances(props.id);
	} catch (error) {
		showNotification('Error', error.message || 'Item update canceled', 'error');
	}
};

const triggerModal = () => {
	isFormVisible.value = !isFormVisible.value;
};

const drawerCancel = () => {
	selectedStorageId.value = storage.value.id;
	triggerModal();
};

const handleSubmit = async () => {
	try {
		await $confirm('Do you want to move this substance?', 'Warning', {
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel',
			type: 'warning'
		});
		const response = await $api.substances.updateSubstance(selectedSubstance.value.id, {
			storageId: selectedStorageId.value,
			category: selectedSubstance.value.category
		});
		setSubstances(props.id);
		$notify({
			title: 'Success',
			message: response.message,
			type: 'success'
		});
	} catch {
		selectedStorageId.value = storage.value.id;
		$notify({
			title: 'Canceled',
			message: 'Reagent deletion was canceled',
			type: 'info'
		});
	} finally {
		triggerModal();
	}
};

onMounted(() => {
	setSubstances(props.id);
	fetchStorage(props.id);
	fetchStorages();
});
</script>

<template>
	<div class="storage-content-table">
		<el-descriptions v-if="storage" :column="1" border>
			<el-descriptions-item label="Room">{{ storage.room }}</el-descriptions-item>
			<el-descriptions-item label="Name">{{ storage.name }}</el-descriptions-item>
			<el-descriptions-item label="Description">{{ storage.description }}</el-descriptions-item>
		</el-descriptions>
		<el-table v-loading="isLoading" :data="substances" @row-click="viewSubstance">
			<el-table-column prop="name" label="Name" />
			<el-table-column prop="category" label="Category" />
			<el-table-column prop="structure" label="Structure" />
			<el-table-column prop="description" label="Description" />
			<el-table-column prop="quantityLeft" label="Quantity Left" />
			<el-table-column width="80">
				<template #default="{ row }">
					<el-button @click.stop="() => moveSubstance(row)">
						<rh-icon name="building" />
					</el-button>
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
						<rh-icon color="white" name="trash" />
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-drawer v-model="isFormVisible" :before-close="drawerCancel">
			<template #header>
				<h2>Move substance to another storage</h2>
			</template>
			<el-form>
				<el-form-item v-if="storage" label="Current storage">
					{{ `${storage.room} - ${storage.name}` }}
				</el-form-item>
				<el-form-item label="Target storage" prop="storages">
					<el-select
						v-model="selectedStorageId"
						class="custom-select"
						placeholder="Please select a storage"
					>
						<el-option
							v-for="storageItem of storages"
							:key="storageItem.id"
							:label="`${storageItem.room} - ${storageItem.name}`"
							:value="storageItem.id"
						/>
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<div>
					<el-button @click="drawerCancel">Cancel</el-button>
					<el-button type="primary" :disabled="!selectedStorageId" @click="handleSubmit">
						Confirm
					</el-button>
				</div>
			</template>
		</el-drawer>
	</div>
</template>

<style scoped>
.storage-content-table {
	display: flex;
	flex-direction: column;
	gap: 30px;
	margin-top: 20px;
}

:deep(.el-form-item) {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
}

:deep(.el-select__wrapper) {
	width: 350px;
}

.modal-form {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.reagent__action-buttons {
	display: flex;
	flex-direction: row;
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
