<script setup>
import { ElForm, ElInput, ElButton, ElFormItem } from 'element-plus';
import { computed, onMounted, useTemplateRef, ref, watch } from 'vue';
import { $notifyUserAboutError, $notify } from '../lib/utils/feedback/notify-msg';
import { $confirm } from '../lib/utils/feedback/confirm-msg.js/';
import { $api } from '../lib/api/index.js';
import { $route } from '../lib/router/router';
import { $isFormValid } from '../lib/utils/form-validation/is-form-valid.js';
import { emptyUser, passwordFormRules } from './constants';

const props = defineProps({ id: { type: String, default: null } });
const user = ref(emptyUser);
const loading = ref(false);
const originalUser = ref(null);
const isEdit = computed(() => $route.value.name === 'user-details-edit');

const resetPassForm = useTemplateRef('reset-pass-form');
const passwords = ref({ password: '', confirmPassword: '' });

const passwordRules = ref(passwordFormRules(passwords));

onMounted(() => {
	setUser(props.id);
});

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
		if (!['cancel', 'close'].includes(error)) {
			resetPassForm.value.resetFields();
		}
	}
};

watch(isEdit, () => {
	resetPassForm.value.resetFields();
});
</script>

<template>
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
