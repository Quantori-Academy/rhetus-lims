<script setup>
import { ref, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElButton } from 'element-plus';
import RhIcon from '../../lib/components/rh-icon.vue';
import { $api } from '../../lib/api/index.js';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $router } from '../../lib/router/router.js';
import { $confirm } from '../../lib/utils/feedback/confirm-msg.js';
import RhFilters from '../../lib/components/rh-filters/rh-filters.vue';
import StorageFilters from '../storage-filters.vue';

const storages = ref([]);
const isLoading = ref(false);

function addNewStorageLocation() {
	$router.push({ name: 'new-storage' });
}

function viewStorageLocation(id) {
	$router.push({ name: 'edit-storage', params: { id } });
	console.log('view storage info', id);
}
function editStorageLocation(id) {
	$router.push({ name: 'edit-storage', params: { id } });
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
	} catch {
		$notify({
			title: 'Canceled',
			message: 'Deletion canceled',
			type: 'info'
		});
	}
}

async function setStorages() {
	isLoading.value = true;
	try {
		const data = await $api.storages.fetchStorages();
		storages.value = data.storages;
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		isLoading.value = false;
	}
}

onMounted(() => {
	setStorages();
});
</script>

<template>
	<div class="wrapper">
		<rh-filters>
			<template #action-buttons>
				<el-button class="add-button" type="primary" @click="addNewStorageLocation">
					Add New Storage Location
				</el-button>
			</template>

			<template #filters>
				<storage-filters />
			</template>
		</rh-filters>

		<el-table v-loading="isLoading" :data="storages">
			<el-table-column prop="room" min-width="150" label="Room" />
			<el-table-column prop="name" min-width="150" label="Name" />
			<el-table-column prop="description" min-width="200" label="Description" />
			<el-table-column width="80">
				<template #default="{ row }">
					<el-button @click="() => viewStorageLocation(row.id)"><rh-icon name="eye" /></el-button>
				</template>
			</el-table-column>
			<el-table-column width="80">
				<template #default="{ row }">
					<el-button @click="() => editStorageLocation(row.id)"
						><rh-icon name="pencil"
					/></el-button>
				</template>
			</el-table-column>
			<el-table-column width="80">
				<template #default="{ row }">
					<el-button type="danger" @click="() => deleteStorageLocation(row.id)">
						<rh-icon color="white" name="trash" />
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<style scoped>
.add-button {
	margin: 20px 0;
	margin-top: 20px;
}
</style>
