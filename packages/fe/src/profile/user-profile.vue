<script setup>
import { onMounted, ref, useTemplateRef, computed } from 'vue';
import { $api } from '../lib/api';
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';
import { $notifyUserAboutError, $notify } from '../lib/utils/feedback/notify-msg';
import { $confirm } from '../lib/utils/feedback/confirm-msg';
import { $isFormValid } from '../lib/utils/form-validation/is-form-valid';
import { passwordFormRules, profileFormRules } from './constants';
import { $route, $router } from '../lib/router/router';

const editable = computed(() => $route.value.name === 'edit-user-profile');
const profile = ref(null);
const form = useTemplateRef('form');

const resetPassForm = useTemplateRef('reset-pass-form');
const passwords = ref({ password: '', confirmPassword: '' });

const profileRules = ref(profileFormRules);
const passwordRules = ref(passwordFormRules(passwords));

const setProfile = async () => {
	try {
		profile.value = await $api.users.fetchCurrentUserInfo();
	} catch (err) {
		$notifyUserAboutError(err);
	}
};

const toggleEdit = async () => {
	if (editable.value) {
		resetPassForm.value.resetFields();
		setProfile();
	}
	$router.push({
		name: editable.value ? 'user-profile' : 'edit-user-profile'
	});
};

const editHandler = async () => {
	if (!(await $isFormValid(form))) return;
	try {
		await $api.users.updateUser(profile.value.id, profile.value);
		editable.value = false;
		$notify({
			title: 'Success',
			message: 'Profile updated',
			type: 'success'
		});
	} catch (err) {
		$notifyUserAboutError(err);
	}
};

const passwordChangeHandler = async () => {
	if (!(await $isFormValid(resetPassForm))) return;

	try {
		await $confirm('Are you sure you want to reset your password?', 'Change password?', {
			type: 'warning'
		});
		const res = await $api.auth.resetPassword(profile.value.id, {
			password: passwords.value.password
		});
		$notify({
			title: 'Success',
			message: res.message,
			type: 'success'
		});
		resetPassForm.value.resetFields();
	} catch (err) {
		if (err !== 'cancel' && err !== 'close') {
				$notifyUserAboutError(err);
			}
	}
};

onMounted(() => {
	setProfile();
});
</script>

<template>
	<div class="wrapper">
		<div class="editing-header">
			My Profile
			<el-button :type="editable ? 'default' : 'primary'" @click="toggleEdit">{{
				editable ? 'Cancel' : 'Edit'
			}}</el-button>
		</div>
		<el-form
			v-if="profile"
			ref="form"
			:model="profile"
			label-position="top"
			:rules="profileRules"
			@submit="editHandler"
		>
			<el-form-item label="Username" prop="username">
				<el-input v-model="profile.username" :disabled="true" />
			</el-form-item>
			<el-form-item label="First name" prop="firstName">
				<el-input v-model="profile.firstName" :disabled="!editable" />
			</el-form-item>
			<el-form-item label="Last name" prop="lastName">
				<el-input v-model="profile.lastName" :disabled="!editable" />
			</el-form-item>
			<el-form-item label="Email" prop="email">
				<el-input v-model="profile.email" :disabled="!editable" />
			</el-form-item>
			<el-form-item label="Role" prop="role">
				<el-input v-model="profile.role.name" :disabled="true" />
			</el-form-item>
			<div v-if="editable" class="btn-container">
				<el-button v-if="editable" type="primary" @click="editHandler">Update</el-button>
			</div>
		</el-form>
	</div>
	<div class="wrapper">
		<div class="section-header">Reset password</div>
		<el-form
			ref="reset-pass-form"
			:model="passwords"
			label-position="top"
			:rules="passwordRules"
			@submit="passwordChangeHandler"
		>
			<el-form-item label="New password" prop="password">
				<el-input
					v-model="passwords.password"
					:disabled="!editable"
					placeholder="Input password"
					type="password"
					show-password
				/>
			</el-form-item>
			<el-form-item label="Confirm password" prop="confirmPassword">
				<el-input
					v-model="passwords.confirmPassword"
					:disabled="!editable"
					placeholder="Confirm password"
					type="password"
					show-password
				/>
			</el-form-item>
			<div v-if="editable" class="btn-container">
				<el-button type="primary" @click="passwordChangeHandler"> Reset password </el-button>
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
@media (max-width: 520px) {
	.form-container {
		width: 220px;
	}
}
</style>
