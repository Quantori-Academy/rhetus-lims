<script setup>
import { onMounted, ref, useTemplateRef, computed } from 'vue';
import RhIcon from '../../lib/components/rh-icon.vue';
import {
	ElTable,
	ElTableColumn,
	ElButton,
	ElSelect,
	ElOption,
	ElForm,
	ElInput,
	ElFormItem,
	ElTooltip
} from 'element-plus';
import { $api } from '../../lib/api/index';
import { $confirm } from '../../lib/utils/feedback/confirm-msg';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid';
import { $route, $router } from '../../lib/router/router.js';
import { formRules } from '../constants';

const props = defineProps({
	id: {
		type: String,
		default: null
	}
});

const substances = ref([]);
const storage = ref([]);
const storages = ref([]);
const isLoading = ref(false);
const formEl = useTemplateRef('form-ref');
const rules = ref(formRules);
const isEdit = computed(() => $route.value.name === 'storage-details-edit');

async function setSubstances(id) {
	isLoading.value = true;
	try {
		const params = { options: { location: id } };
		const data = await $api.substances.fetchSubstances(params);

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

const cancelEdit = () => {
	$router.push({ name: 'storage-details' });
};

const handleSubmit = async () => {
	try {
		if (!(await $isFormValid(formEl))) {
			$notifyUserAboutError('Error submitting form');
			return;
		}

		const response = await $api.storages.updateStorage(storage.value.id, storage.value);
		$notify({
			title: 'Success',
			message: response.message,
			type: 'success'
		});
		$router.push({ name: 'storage-details' });
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating storage');
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
		setSubstances(props.id);
		$notify({
			title: 'Success',
			message: response.message,
			type: 'success'
		});
	} catch {
		$notify({
			title: 'Canceled',
			message: 'Reagent deletion was canceled',
			type: 'info'
		});
	}
};

async function deleteStorage() {
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
			const response = await $api.storages.deleteStorage(props.id);
			$notify({
				title: 'Success',
				message: response.message,
				type: 'success'
			});
			$router.push({ name: 'storages-list' });
		} catch (err) {
			$notifyUserAboutError(err);
		}
	} catch {
		$notify({
			title: 'Canceled',
			message: 'Deletion canceled',
			type: 'info'
		});
	}
}

const toggleEdit = () => {
	$router.push({ name: 'storage-details-edit', params: { id: storage.value.id } });
};

onMounted(() => {
	setSubstances(props.id);
	fetchStorage(props.id);
	fetchStorages();
});
</script>

<template>
	<div class="storage-content-table">
		<el-form
			v-if="storage"
			ref="form-ref"
			label-position="top"
			:model="storage"
			:rules="rules"
			@submit="handleSubmit"
		>
			<el-form-item label="Room" prop="room">
				<el-input v-model="storage.room" :disabled="!isEdit" />
			</el-form-item>
			<el-form-item label="Name" prop="name">
				<el-input v-model="storage.name" :disabled="!isEdit" />
			</el-form-item>
			<el-form-item label="Description" prop="description">
				<el-input v-model="storage.description" :disabled="!isEdit" />
			</el-form-item>
			<template v-if="isEdit">
				<el-button @click="cancelEdit">Cancel</el-button>
				<el-button type="primary" @click="handleSubmit">Save</el-button>
			</template>
			<template v-else>
				<el-button type="primary" @click="toggleEdit">{{ 'Edit storage' }}</el-button>
				<el-tooltip
					:disabled="storage.isEmpty"
					content="Can't delete, storage is not empty."
					placement="top"
				>
					<el-button type="danger" :disabled="!storage.isEmpty" @click="deleteStorage">
						{{ 'Delete storage' }}
					</el-button>
				</el-tooltip>
			</template>
		</el-form>
		<el-table v-loading="isLoading" :data="substances" @row-click="viewSubstance">
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
						<rh-icon color="white" name="trash" />
					</el-button>
				</template>
			</el-table-column>
		</el-table>
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
}

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
