<script setup>
import {
	ElForm,
	ElInput,
	ElButton,
	ElFormItem,
	ElSelect,
	ElOption,
	ElDatePicker
} from 'element-plus';
import { computed, onMounted, useTemplateRef, ref } from 'vue';
import { $notifyUserAboutError, $notify } from '../lib/utils/feedback/notify-msg';
import { $confirm } from '../lib/utils/feedback/confirm-msg.js/';
import { $api } from '../lib/api/index.js';
import { $route, $router } from '../lib/router/router';
import { $isFormValid } from '../lib/utils/form-validation/is-form-valid.js';
import { formRules } from './constants';

const props = defineProps({
	id: {
		type: String,
		default: null
	}
});

const formEl = useTemplateRef('form-ref');
const user = ref(null);
const loading = ref(false);
const originalUser = ref(null);
const roles = ref([]);
const rules = ref(formRules);
const roleName = computed(() => {
	return roles.value.find(role => role.id === user.value.roleId).name;
});
const isEdit = computed(() => $route.value.name === 'user-details-edit');

onMounted(() => {
	setUser(props.id);
	setRoles();
});

async function setRoles() {
	loading.value = true;
	try {
		const data = await $api.users.getRoles();
		roles.value = data.roles;
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		loading.value = false;
	}
}
const setUser = async id => {
	loading.value = true;
	try {
		const data = await $api.users.fetchUser(id);
		const { role, ...userData } = data;
		user.value = {
			...userData,
			roleId: role.id
		};
		originalUser.value = {
			...userData,
			roleId: role.id
		};
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating user');
	} finally {
		loading.value = false;
	}
};

const toggleEdit = () => {
	$router.push({ name: 'user-details-edit', params: { id: user.value.id } });
};
const cancelEdit = () => {
	$router.push({ name: 'user-details', params: { id: user.value.id } });
	$notify({
		title: 'Canceled',
		message: 'User deletion canceled',
		type: 'info'
	});
	user.value = { ...originalUser.value };
	formEl.value.resetFields();
};

const handleSubmit = async () => {
	if (!(await $isFormValid(formEl))) return;
	try {
		const updatedUser = await $api.users.updateUser(user.value.id, user.value);
		user.value = updatedUser;
		$notify({
			title: 'Success',
			message: 'User has been updated',
			type: 'success'
		});
		$router.push({ name: 'user-details', params: { id: user.value.id } });
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating user');
	}
};
const confirmRoleChange = async () => {
	if (user.value.roleId !== originalUser.value.roleId) {
		try {
			const confirmed = await $confirm(
				`Are you sure you want to change the role to ${roleName.value}?`,
				'Confirm Role Change',
				{
					confirmButtonText: 'Yes, Change Role',
					cancelButtonText: 'Cancel',
					type: 'warning'
				}
			);
			originalUser.value.roleId = user.value.roleId;
			return confirmed;
		} catch (error) {
			$notifyUserAboutError(error.message || 'Role update canceled');
			return false;
		}
	}
	return true;
};

const changePassword = async () => {
	try {
		const confirmed = await $confirm(
			'Are you sure you want to change your password?',
			'Confirm Password Change',
			{
				confirmButtonText: 'Yes',
				cancelButtonText: 'No',
				type: 'warning'
			}
		);
		if (confirmed) {
			const response = await $api.users.changePassword(user.value.id, true);
			console.log(response);
			$notify({
				title: 'Success',
				message: 'Password change request has been sent',
				type: 'success'
			});
		}
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error requesting password change');
	}
};

const deleteUser = async () => {
	try {
		await $confirm('Do you want to delete this user?', 'Warning', {
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel',
			type: 'warning'
		});
		try {
			const response = await $api.users.deleteUser(props.id);
			$notify({
				title: 'Success',
				message: response.message,
				type: 'success'
			});
			$router.push({ name: 'users-list' });
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
</script>

<template>
	<div class="wrapper">
		<el-form
			v-if="user"
			ref="form-ref"
			v-loading="loading || !user"
			label-position="top"
			:model="user"
			:rules="rules"
			@submit="handleSubmit"
		>
			<el-form-item label="Username" prop="username">
				<el-input v-model="user.username" :disabled="true" />
			</el-form-item>
			<el-form-item label="First name" prop="firstName">
				<el-input v-model="user.firstName" :disabled="!isEdit" />
			</el-form-item>
			<el-form-item label="Last name" prop="lastName">
				<el-input v-model="user.lastName" :disabled="!isEdit" />
			</el-form-item>
			<el-form-item label="Email" prop="email">
				<el-input v-model="user.email" :disabled="!isEdit" />
			</el-form-item>
			<el-form-item label="Role" prop="role">
				<el-select v-model="user.roleId" :disabled="!isEdit" @change="confirmRoleChange">
					<el-option
						v-for="role of roles"
						:key="role.id"
						:label="role.name"
						:value="role.id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item class="last-input" label="Creation date" prop="creationDate">
				<el-date-picker
					v-model="user.createdAt"
					type="date"
					format="YYYY-MM-DD"
					value-format="YYYY-MM-DD"
					:disabled="true"
				/>
			</el-form-item>
			<template v-if="isEdit">
				<el-button type="primary" @click="handleSubmit">{{ '		Save' }}</el-button>
				<el-button @click="cancelEdit">Cancel</el-button>
			</template>
			<template v-else>
				<el-button type="primary" @click="toggleEdit">{{ 'Edit profile' }}</el-button>
				<el-button type="warning" @click="changePassword">Change password</el-button>
				<el-button type="danger" @click="deleteUser">{{ 'Delete user' }}</el-button>
			</template>
		</el-form>
	</div>
</template>

<style scoped>
.wrapper {
	color: black;
}
.el-form-item {
	margin-bottom: 10px;
}
.el-form {
	width: 50vw;
}
.el-form-item:last-of-type {
	margin-bottom: 20px;
}
.el-form-item .el-input.is-disabled .el-input__wrapper,
.el-form-item .el-select .el-select__wrapper.is-disabled {
	background-color: transparent;
}
@media screen and (max-width: 750px) {
	.el-form {
		width: 80vw;
	}
}
</style>
