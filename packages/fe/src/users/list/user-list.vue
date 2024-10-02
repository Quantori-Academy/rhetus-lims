<script setup>
import { ref, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElButton } from 'element-plus';
import RhIcon from '../../lib/components/rh-icon.vue';
import { $api } from '../../lib/api/index.js';
import { $confirm } from '../../lib/utils/feedback/confirm-msg';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { formatDate } from '../../lib/utils/datetime/date-format.js';
import { router } from '../../lib/router/router.js';

const users = ref([]);
const isLoading = ref(false);

function addNewUser() {
	router.push({ name: 'new-user' });
}

function viewUserDetails(id) {
	router.push({ name: 'user-details', params: { id } });
}

function editUser(id) {
	router.push({ name: 'edit-user', params: { id } });
}

const deleteUser = async (id) => {
	try {
		await $confirm('Do you want to delete this user?', 'Warning', {
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel',
			type: 'warning'
		})
		try {
			const response = await $api.users.deleteUser(id);
			$notify({
				title: 'Success',
				message: response.message,
				type: 'success',
			});
			await setUsers()
		} catch(error) {
			$notifyUserAboutError(error);
		}
	} catch(error) {
		console.log(error)
		$notify({
			title: 'Canceled',
			message: 'User deletion canceled',
			type: 'info'
		});
	}
};

async function setUsers() {
	isLoading.value = true;
	try {
		users.value = await $api.users.fetchUsers();
		console.log(users.value);
	} catch (error) {
		$notifyUserAboutError(error);
	}

	isLoading.value = false;
}

onMounted(() => {
	setUsers();
});
</script>

<template>
	<div>
		<el-button class="add-button" type="primary" @click="addNewUser">Add New User</el-button>

		<el-table v-loading="isLoading" :data="users">
			<el-table-column prop="username" label="User name" />
			<el-table-column prop="firstName" label="First Name" />
			<el-table-column prop="lastName" label="Last Name" />
			<el-table-column prop="email" label="Email" width="150" />
			<el-table-column prop="role" label="Role" :formatter="data => data.role.name" />
			<el-table-column
				prop="lastLogin"
				label="Last login"
				width="120"
				:formatter="data => formatDate(data.lastLogin)"
			/>
			<el-table-column width="80">
				<template #default="{ row }">
					<el-button @click="() => viewUserDetails(row.id)"><rh-icon name="eye" /></el-button>
				</template>
			</el-table-column>
			<el-table-column width="80">
				<template #default="{ row }">
					<el-button @click="() => editUser(row.id)"><rh-icon name="pencil" /></el-button>
				</template>
			</el-table-column>
			<el-table-column width="80">
				<template #default="{ row }">
					<el-button type="danger" @click="() => deleteUser(row.id)">
						<rh-icon color="white" name="trash" />
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<style scoped>
.add-button {
	margin-bottom: 20px;
}
</style>
