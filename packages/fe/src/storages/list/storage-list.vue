<script setup>
import { ref, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElButton } from 'element-plus';
import RhIcon from '../../lib/components/rh-icon.vue';
import { $api } from '../../lib/api/index.js';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $router } from '../../lib/router/router.js';
import { $confirm } from '../../lib/utils/feedback/confirm-msg.js';

const storages = ref([]);
const isLoading = ref(false);

function addNewStorageLocation() {
	$router.push({ name: 'new-storage' });
}

function viewStorageLocation(id) {
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
		<h1>Storage Location Management</h1>
		<el-button class="add-button" type="primary" @click="addNewStorageLocation"
			>Add New Storage Location</el-button
		>
		<el-table v-loading="isLoading" :data="storages">
			<el-table-column prop="room" label="Room" width="180" />
			<el-table-column prop="name" label="Name" width="180" />
			<el-table-column prop="description" label="Description" width="180" />
			<el-table-column>
				<template #default="{ row }">
					<el-button @click="() => viewStorageLocation(row.id)"><rh-icon name="eye" /></el-button>
				</template>
			</el-table-column>
			<el-table-column>
				<template #default="{ row }">
					<el-button @click="() => editStorageLocation(row.id)"
						><rh-icon name="pencil"
					/></el-button>
				</template>
			</el-table-column>
			<el-table-column>
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
}
</style>
