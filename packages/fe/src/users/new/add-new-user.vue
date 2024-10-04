<script setup>
import { ref, useTemplateRef } from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton, ElSelect, ElOption } from 'element-plus';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { router } from '../../lib/router/router.js';
import { $api } from '../../lib/api/index.js';

const isSaving = ref(false);
const formEl = useTemplateRef('form-ref');
const form = ref({
	username: '',
	firstName: '',
	lastName: '',
	email: '',
	password: '',
	role: ''
});

const requiredRule = { required: true, message: 'Required field', trigger: ['blur', 'change'] };
const rules = ref({
	username: [requiredRule],
	email: [{ required: true, type: 'email', message: 'Required field' }],
	password: [requiredRule],
	role: [requiredRule]
});
async function addUser() {
	if (!(await validate())) return;

	isSaving.value = true;

	try {
		const response = await $api.users.addUser(form.value);
		$notify({ message: response.message, type: 'success' });
		router.push({ name: 'users-list' });
	} catch (error) {
		$notifyUserAboutError(error);
	}

	isSaving.value = false;
}

const resetForm = () => {
	form.value = {
		username: '',
		name: '',
		lastname: '',
		email: '',
		password: '',
		confirmPassword: '',
		role: ''
	};
};

async function validate() {
	return formEl.value.validate();
}

const cancelHandler = () => {
	resetForm();
	router.push({ name: 'users-list' });
};
</script>

<template>
	<el-form ref="form-ref" :rules="rules" label-position="top" :model="form">
		<el-form-item label="Username" prop="username">
			<el-input v-model="form.username" placeholder="Enter username"></el-input>
		</el-form-item>
		<el-form-item label="First Name" prop="name">
			<el-input v-model="form.firstName" placeholder="Enter first name"></el-input>
		</el-form-item>
		<el-form-item label="Last Name" prop="lastname">
			<el-input v-model="form.lastName" placeholder="Enter last name"></el-input>
		</el-form-item>
		<el-form-item label="Email" prop="email">
			<el-input v-model="form.email" placeholder="Enter email"></el-input>
		</el-form-item>
		<el-form-item label="Password" prop="password">
			<el-input v-model="form.password" placeholder="Enter password" type="password"></el-input>
		</el-form-item>
		<el-form-item label="Role" prop="role">
			<el-select v-model="form.role" placeholder="Select role">
				<el-option label="Admin" value="Admin"></el-option>
				<el-option label="Procurement Officer" value="Procurement Officer"></el-option>
				<el-option label="Researcher" value="Researcher"></el-option>
			</el-select>
		</el-form-item>
		<el-button @click="cancelHandler">Cancel Creation </el-button>
		<el-button :loading="isSaving" type="primary" @click="addUser">Add User</el-button>
	</el-form>
</template>
