<script setup>
import { onMounted, ref, useTemplateRef } from 'vue';
import { $api } from '../lib/api';
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';
import { $notifyUserAboutError, $notify } from '../lib/utils/feedback/notify-msg';
import { $confirm } from '../lib/utils/feedback/confirm-msg';
import { $isFormValid } from '../lib/utils/form-validation/is-form-valid';

const editable = ref(false);
const profile = ref(null);
const form = useTemplateRef('form');
const password = ref(false);
const newPassword = ref('');

const setProfile = async () => {
	try {
		profile.value = await $api.users.fetchCurrentUserInfo();
	} catch (err) {
		$notifyUserAboutError(err);
	}
};
const cancelEdit = () => {
	setProfile();
	editable.value = false;
};
const ifEdit = () => {
	editable.value = !editable.value;
};
const requiredRule = { required: true, message: 'Length should be at least 1', trigger: 'blur' };
const rules = ref({
	firstName: [requiredRule],
	lastName: [requiredRule],
	email: [
		requiredRule,
		{ type: 'email', message: 'Please input correct email address', trigger: 'blur' }
	]
});
async function validate() {
	return $isFormValid(form);
}
const onProfileEdit = () => {
	if (editable.value) {
		cancelEdit();
	} else {
		ifEdit();
	}
};
const editHandler = async () => {
	if (!(await validate())) return;
	try {
		if (newPassword.value) {
			profile.value = { ...profile.value, password: newPassword };
		}
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
const passwordChangeHandler = () => {
	async function confirmed() {
		try {
			await $confirm('Are you sure you want to change password?', 'Please, confirm your action', {
				confirmButtonText: 'Yes',
				cancelButtonText: 'No',
				type: 'warning'
			});
			password.value = true;
		} catch (err) {
			$notifyUserAboutError(err);
		}
	}
	confirmed();
};
onMounted(() => {
	setProfile();
});
</script>

<template>
	<div class="profile">
		<el-form
			v-if="profile"
			ref="form"
			class="el-form"
			:model="profile"
			label-position="top"
			:rules="rules"
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
			<el-form-item v-if="password" label="Password" prop="password">
				<el-input v-model="newPassword" type="password" :readonly="!editable" show-password />
			</el-form-item>
			<el-form-item>
				<el-button :type="editable ? 'default' : 'primary'" @click="onProfileEdit">{{
					editable ? 'Cancel' : 'Edit'
				}}</el-button>
				<el-button v-if="editable" type="primary" @click="editHandler">Save</el-button>
				<el-button v-if="editable" type="warning" @click="passwordChangeHandler"
					>Change password</el-button
				>
			</el-form-item>
		</el-form>
	</div>
</template>

<style scoped>
.profile {
	margin: 0 15px;
	margin-top: 20px;
}
.el-form {
	width: 500px;
}
@media (max-width: 520px) {
	.el-form {
		width: 220px;
	}
}
</style>
