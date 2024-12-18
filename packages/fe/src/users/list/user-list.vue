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
import { __ } from '../../lib/locales/index.js';
import RhPagination from '../../lib/components/rh-pagination/rh-pagination.vue';

const users = ref([]);
const isLoading = ref(false);
const filters = ref({
	role: '',
	lastLogin: []
});
const pagination = ref({
	page: 1,
	size: 10,
	totalElements: 0
});

const handlePageChange = newPage => {
	pagination.value.page = newPage;
	setUsers();
};

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
		await $confirm(__('Do you want to delete this user?'), 'Warning', {
			confirmButtonText: 'OK',
			cancelButtonText: __('Cancel'),
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
		if (!['cancel', 'close'].includes(error)) {
			this.$notifyUserAboutError(error);
		}
	}
};

const setUsers = debounce(async () => {
	isLoading.value = true;
	try {
		const data = await $api.users.fetchUsers(filters.value);
		users.value = data.users;
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		isLoading.value = false;
	}
}, 200);

watch(
	filters,
	() => {
		pagination.value.page = 1;
		setUsers();
	},
	{ deep: true }
);

onMounted(() => {
	setUsers();
});
</script>

<template>
	<div class="margin-table">
		<rh-filters>
			<template #action-buttons>
				<el-button type="primary" @click="addNewUser">{{ __('Add New User') }}</el-button>
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
						<rh-icon name="approval" color="#4c8fd2" size="18" class="password-icon" />
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="username" min-width="150" :label="__('Username')" />
			<el-table-column prop="firstName" min-width="150" :label="__('First name')" />
			<el-table-column prop="lastName" min-width="150" :label="__('Last name')" />
			<el-table-column prop="email" min-width="150" :label="__('Email')" />
			<el-table-column
				prop="role"
				min-width="150"
				:label="__('Role')"
				:formatter="data => data.role.name"
			/>
			<el-table-column
				prop="lastLogin"
				:label="__('Last login')"
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
						<rh-icon color="white" name="remove" />
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<rh-pagination :pagination="pagination" @change-page="handlePageChange" />
	</div>
</template>

<style scoped>
:deep(.el-table__row):hover {
	cursor: pointer;
}
.password-icon {
	margin-top: 4px;
}
</style>
