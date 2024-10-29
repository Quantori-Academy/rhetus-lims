<script setup>
import { ref, watch, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElButton, ElTooltip } from 'element-plus';
import RhIcon from '../../lib/components/rh-icon.vue';
import { $api } from '../../lib/api/index.js';
import { $confirm } from '../../lib/utils/feedback/confirm-msg';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { formatDate } from '../../lib/utils/datetime/date-format.js';
import { $router } from '../../lib/router/router.js';
import RhFilters from '../../lib/components/rh-filters/rh-filters.vue';
import UsersFilters from '../users-filters.vue';
import { debounce } from '../../lib/utils/debounce/debounce.js';

const users = ref([]);
const isLoading = ref(false);
const filters = ref({
	role: '',
	date: null
});

function addNewUser() {
	$router.push({ name: 'new-user' });
}

function viewUserDetails(row) {
	$router.push({ name: 'user-details', params: { id: row.id } });
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
		if (err !== 'cancel' && err !== 'close') {
			$notify({
				title: 'Canceled',
				message: 'User deletion canceled',
				type: 'info'
			});
		}
	}
};

const setUsers = debounce(async () => {
	isLoading.value = true;
	try {
		const data = await $api.users.fetchUsers(filters.value);
		users.value = data.items;
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		isLoading.value = false;
	}
}, 200);

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
	<div class="user-table">
		<rh-filters>
			<template #action-buttons>
				<el-button type="primary" @click="addNewUser">Add New User</el-button>
			</template>

			<template #filters>
				<users-filters v-model:filters="filters" />
			</template>
		</rh-filters>

		<el-table v-loading="isLoading" :data="users" @row-click="viewUserDetails">
			<el-table-column width="50">
				<template #default="{ row }">
					<el-tooltip
						v-if="row.hasPasswordResetRequests"
						:content="`${row.username} has a password reset request`"
					>
						<rh-icon name="lock" color="#4c8fd2" size="18" class="password-icon" />
					</el-tooltip>
				</template>
			</el-table-column>
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
					<el-button @click.stop="() => editUser(row.id)"><rh-icon name="pencil" /></el-button>
				</template>
			</el-table-column>
			<el-table-column width="80">
				<template #default="{ row }">
					<el-button type="danger" @click.stop="() => deleteUser(row.id)">
						<rh-icon color="white" name="trash" />
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<style scoped>
.user-table {
	margin-top: 20px;
}

:deep(.el-table__row):hover {
	cursor: pointer;
}
.password-icon {
	margin-top: 4px;
}
</style>
