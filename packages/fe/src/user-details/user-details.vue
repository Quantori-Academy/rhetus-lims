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
import { formRules, emptyUser, passwordFormRules } from './constants';

const props = defineProps({ id: { type: String, default: null } });

const formEl = useTemplateRef('form-ref');
const user = ref(emptyUser);
const loading = ref(false);
const originalUser = ref(null);
const roles = ref([]);
const rules = ref(formRules);
const roleName = computed(() => roles.value.find(role => role.id === user.value.roleId).name);
const isEdit = computed(() => $route.value.name === 'user-details-edit');

const resetPassForm = useTemplateRef('reset-pass-form');
const passwords = ref({ password: '', confirmPassword: '' });

const passwordRules = ref(passwordFormRules(passwords));

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
	resetPassForm.value.resetFields();
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
		return confirmed;
	} catch (error) {
		if (error !== 'cancel' && error !== 'close') {
			$notifyUserAboutError(error.message || 'Role update canceled');
		}
		user.value.roleId = originalUser.value.roleId;
		return false;
	}
};

const changePassword = async () => {
	if (!(await $isFormValid(resetPassForm))) return;
	try {
		await $confirm(
			'This will set a temporary password that the user can log in with.',
			'Password Change?',
			{ type: 'warning' }
		);
		const res = await $api.auth.setTemporaryPassword(user.value.id, {
			password: passwords.value.password
		});
		$notify({
			title: 'Success',
			message: res.message,
			type: 'success'
		});
		resetPassForm.value.resetFields();
	} catch (error) {
		if (error !== 'cancel' && error !== 'close') {
			$notifyUserAboutError(error.message || 'Error requesting password change');
		}
	}
};

const deleteUser = async () => {
	try {
		await $confirm('Do you want to delete this user?', 'Warning', {
			confirmButtonText: 'OK',
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
		if (error !== 'cancel' && error !== 'close') {
			$notify({
				title: 'Canceled',
				message: 'User deletion canceled',
				type: 'info'
			});
		}
	}
};
</script>

<template>
	<div class="wrapper">
		<div class="editing-header">
			Profile
			<el-button v-if="!isEdit" type="primary" @click="toggleEdit">{{ 'Edit profile' }}</el-button>
		</div>
		<el-form
			ref="form-ref"
			v-loading="loading"
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
					<el-option v-for="role of roles" :key="role.id" :label="role.name" :value="role.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="Creation date" prop="creationDate">
				<el-date-picker v-model="user.createdAt" type="date" format="YYYY-MM-DD" :disabled="true" />
			</el-form-item>
			<div v-if="isEdit" class="btn-container">
				<el-button type="primary" @click="handleSubmit">Save</el-button>
				<el-button @click="cancelEdit">Cancel</el-button>
			</div>
			<div v-else class="btn-container">
				<el-button type="danger" @click="deleteUser">Delete user</el-button>
			</div>
		</el-form>
	</div>
	<div class="wrapper">
		<div class="section-header">Manage password</div>
		<el-form
			ref="reset-pass-form"
			:model="passwords"
			label-position="top"
			:rules="passwordRules"
			@submit="changePassword"
		>
			<el-form-item label="New password" prop="password">
				<el-input
					v-model="passwords.password"
					:disabled="!isEdit"
					placeholder="Input password"
					type="password"
					show-password
				/>
			</el-form-item>
			<el-form-item label="Confirm password" prop="confirmPassword">
				<el-input
					v-model="passwords.confirmPassword"
					:disabled="!isEdit"
					placeholder="Confirm password"
					type="password"
					show-password
				/>
			</el-form-item>
			<div v-if="isEdit" class="btn-container">
				<el-button type="primary" @click="changePassword">Reset password</el-button>
			</div>
		</el-form>
	</div>
</template>

<style scoped>
.section-header {
	margin-bottom: 12px;
	font-weight: 500;
	font-size: large;
}
.el-form-item {
	margin-bottom: 10px;
}
.el-form-item:last-of-type {
	margin-bottom: 20px;
}
.el-form-item .el-input.is-disabled .el-input__wrapper,
.el-form-item .el-select .el-select__wrapper.is-disabled {
	background-color: transparent;
}
</style>
