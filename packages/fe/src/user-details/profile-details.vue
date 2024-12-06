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
import { $notifyUserAboutError, $notify } from '../lib/utils/feedback/notify-msg.js';
import { $confirm } from '../lib/utils/feedback/confirm-msg.js/';
import { $api } from '../lib/api/index.js';
import { $route, $router } from '../lib/router/router.js';
import { $isFormValid } from '../lib/utils/form-validation/is-form-valid.js';
import { formRules, emptyUser } from './constants.js';
import { __ } from '../lib/locales/index.js';

const props = defineProps({ id: { type: String, default: null } });

const formEl = useTemplateRef('form-ref');
const user = ref(emptyUser);
const loading = ref(false);
const originalUser = ref(null);
const roles = ref([]);
const rules = ref(formRules);
const roleName = computed(() => roles.value.find(role => role.id === user.value.roleId).name);
const isEdit = computed(() => $route.value.name === 'user-details-edit');

onMounted(() => {
	setUser(props.id);
	setRoles();
});

async function setRoles() {
	loading.value = true;
	try {
		roles.value = await $api.users.getRoles();
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
		$notifyUserAboutError(error.message || __('Error updating user'));
	} finally {
		loading.value = false;
	}
};

const toggleEdit = () => {
	$router.push({ name: 'user-details-edit', params: { id: user.value.id } });
};

const cancelEdit = () => {
	$router.push({ name: 'user-details', params: { id: user.value.id } });
	user.value = { ...originalUser.value };
	formEl.value.resetFields();
};

const handleSubmit = async () => {
	if (!(await $isFormValid(formEl))) return;
	try {
		await $api.users.updateUser(user.value.id, user.value);
		$notify({
			title: 'Success',
			message: __('User has been updated'),
			type: 'success'
		});
		$router.push({ name: 'user-details', params: { id: user.value.id } });
		setUser(props.id);
	} catch (error) {
		$notifyUserAboutError(error.message || __('Error updating user'));
	}
};

const confirmRoleChange = async () => {
	try {
		const confirmed = await $confirm(
			`Are you sure you want to change the role to ${roleName.value}?`,
			'Confirm Role Change',
			{
				confirmButtonText: __('Yes, Change Role'),
				cancelButtonText: __('Cancel'),
				type: 'warning'
			}
		);
		return confirmed;
	} catch (error) {
		if (!['cancel', 'close'].includes(error)) {
			this.$notifyUserAboutError(error);
		}
		user.value.roleId = originalUser.value.roleId;
		return false;
	}
};

const deleteUser = async () => {
	try {
		await $confirm(__('Do you want to delete this user?'), 'Warning', {
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
		if (!['cancel', 'close'].includes(error)) {
			this.$notifyUserAboutError(error);
		}
	}
};
</script>

<template>
	<div class="wrapper">
		<div class="editing-header">
			{{ __('Profile') }}
			<el-button v-if="!isEdit" type="primary" @click="toggleEdit">{{ __('Edit') }}</el-button>
		</div>
		<el-form
			ref="form-ref"
			v-loading="loading"
			label-position="top"
			:model="user"
			:rules="rules"
			@submit="handleSubmit"
		>
			<el-form-item :label="__('Username')" prop="username">
				<el-input v-model="user.username" :disabled="true" />
			</el-form-item>
			<el-form-item :label="__('First name')" prop="firstName">
				<el-input v-model="user.firstName" :disabled="!isEdit" />
			</el-form-item>
			<el-form-item :label="__('Last name')" prop="lastName">
				<el-input v-model="user.lastName" :disabled="!isEdit" />
			</el-form-item>
			<el-form-item :label="__('Email')" prop="email">
				<el-input v-model="user.email" :disabled="!isEdit" />
			</el-form-item>
			<el-form-item :label="__('Role')" prop="role">
				<el-select v-model="user.roleId" :disabled="!isEdit" @change="confirmRoleChange">
					<el-option v-for="role of roles" :key="role.id" :label="role.name" :value="role.id" />
				</el-select>
			</el-form-item>
			<el-form-item :label="__('Creation Date')" prop="creationDate">
				<el-date-picker v-model="user.createdAt" type="date" format="YYYY-MM-DD" :disabled="true" />
			</el-form-item>
			<div v-if="isEdit" class="btn-container">
				<el-button type="primary" @click="handleSubmit">{{ __('Save') }}</el-button>
				<el-button @click="cancelEdit">{{ __('Cancel') }}</el-button>
			</div>
			<div v-else class="btn-container">
				<el-button type="danger" @click="deleteUser">{{ __('Delete user') }}</el-button>
			</div>
		</el-form>
	</div>
</template>

<style scoped>
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
