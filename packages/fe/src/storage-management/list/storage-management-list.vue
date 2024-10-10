<script setup>
import { ref, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElButton, ElTooltip } from 'element-plus';
import RhIcon from '../../lib/components/rh-icon.vue';
import { $api } from '../../lib/api/index.js';
import { $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $router } from '../../lib/router/router.js';

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

function deleteStorageLocation(id) {
	console.log('delete user', id);
}
async function setStorages() {
	isLoading.value = true;
	try {
		const data = await $api.storages.fetchStorages();
		storages.value = data.storages;
	} catch (error) {
		$notifyUserAboutError(error);
	}

	isLoading.value = false;
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
			<el-table-column width="80">
				<template #default="{ row }">
					<el-tooltip class="box-item" effect="dark" content="View content" placement="top-end">
						<el-button @click="() => viewStorageLocation(row.id)"><rh-icon name="eye" /></el-button>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column width="80">
				<template #default="{ row }">
					<el-tooltip class="box-item" effect="dark" content="Edit" placement="top-end">
						<el-button @click="() => editStorageLocation(row.id)"
							><rh-icon name="pencil"
						/></el-button>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column width="80">
				<template #default="{ row }">
					<el-tooltip class="box-item" effect="dark" content="Delete" placement="top-end">
						<el-button type="danger" @click="() => deleteStorageLocation(row.id)">
							<rh-icon color="white" name="trash" />
						</el-button>
					</el-tooltip>
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
