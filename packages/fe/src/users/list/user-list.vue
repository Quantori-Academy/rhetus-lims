<script setup>
import { ref, watch, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElButton } from 'element-plus';
import RhIcon from '../../lib/components/rh-icon.vue';
import { $api } from '../../lib/api/index.js';
import { $confirm } from '../../lib/utils/feedback/confirm-msg';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { formatDate } from '../../lib/utils/datetime/date-format.js';
import { $router } from '../../lib/router/router.js';
import RhFilters from '../../lib/components/rh-filters/rh-filters.vue';
import UsersFilters from '../users-filters.vue';

const users = ref([]);
const isLoading = ref(false);
const filters = ref({
	role: '',
	date: null
});

function addNewUser() {
	$router.push({ name: 'new-user' });
}

function viewUserDetails(id) {
	$router.push({ name: 'user-details', params: { id } });
}

function editUser(id) {
	$router.push({
		name: 'user-details-edit',
		params: { id: id }
	});
}

const deleteUser = async id => {
	try {
		await $confirm('Do you want to delete this user?', 'Warning', {
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel',
			type: 'warning'
		});
		try {
			const response = await $api.users.deleteUser(id);
			$notify({
				title: 'Success',
				message: response.message,
				type: 'success'
			});
			await setUsers();
		} catch (error) {
			$notifyUserAboutError(error);
		}
	} catch (error) {
		console.log(error);
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
		const data = await $api.users.fetchUsers(filters.value);
		users.value = data.items;
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		isLoading.value = false;
	}
}

watch(
	filters,
	() => {
		setUsers();
	},
	{ deep: true }
);

onMounted(() => {
	setUsers();
});
</script>

<template>
	<div>
		<rh-filters>
			<template #action-buttons>
				<el-button class="add-button" type="primary" @click="addNewUser">Add New User</el-button>
			</template>

			<template #filters>
				<users-filters v-model:filters="filters" />
			</template>
		</rh-filters>

		<el-table v-loading="isLoading" :data="users">
			<el-table-column prop="username" min-width="150" label="User name" />
			<el-table-column prop="firstName" min-width="150" label="First Name" />
			<el-table-column prop="lastName" min-width="150" label="Last Name" />
			<el-table-column prop="email" min-width="150" label="Email" />
			<el-table-column
				prop="role"
				min-width="150"
				label="Role"
				:formatter="data => data.role.name"
			/>
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
.users-container {
	margin: 20px 0;
}
</style>
