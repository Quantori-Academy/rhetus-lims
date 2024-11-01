<script setup>
import { ref, useTemplateRef, onMounted } from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton, ElSelect, ElOption } from 'element-plus';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $router } from '../../lib/router/router.js';
import { $api } from '../../lib/api/index.js';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid.js';

const roles = ref([]);
const isSaving = ref(false);
const formEl = useTemplateRef('form-ref');
const form = ref({
	username: '',
	firstName: '',
	lastName: '',
	email: '',
	password: '',
	roleId: ''
});

const requiredRule = { required: true, message: 'Required field', trigger: ['blur', 'change'] };
const rules = ref({
	username: [requiredRule],
	email: [{ required: true, type: 'email', message: 'Required field' }],
	password: [
		requiredRule,
		{ min: 8, message: 'Password must be at least 8 characters long', trigger: ['blur', 'change'] }
	],
	roleId: [requiredRule]
});
async function addUser() {
	if (!(await validate())) return;

	isSaving.value = true;

	try {
		const response = await $api.users.addUser(form.value);
		$notify({ message: response.message, type: 'success' });
		$router.push({ name: 'users-list' });
	} catch (error) {
		$notifyUserAboutError(error);
	}

	isSaving.value = false;
}

async function setRoles() {
	try {
		const data = await $api.users.getRoles();
		roles.value = data.roles;
	} catch (error) {
		$notifyUserAboutError(error);
	}
}

onMounted(() => {
	setRoles();
});

const resetForm = () => {
	form.value = {
		username: '',
		name: '',
		lastname: '',
		email: '',
		password: '',
		confirmPassword: '',
		roleId: ''
	};
};

async function validate() {
	return $isFormValid(formEl);
}

const cancelHandler = () => {
	resetForm();
	$router.push({ name: 'users-list' });
};
</script>

<template>
	<el-form ref="form-ref" :rules="rules" label-position="top" :model="form" class="form-container">
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
			<el-input
				v-model="form.password"
				placeholder="Enter password"
				type="password"
				show-password
			></el-input>
		</el-form-item>
		<el-form-item label="Role" prop="role">
			<el-select v-model="form.roleId" placeholder="Select role">
				<el-option
					v-for="role of roles"
					:key="role.id"
					:label="role.name"
					:value="role.id"
				></el-option>
			</el-select>
		</el-form-item>
		<div class="align-end">
			<el-button @click="cancelHandler">Cancel</el-button>
			<el-button :loading="isSaving" type="primary" @click="addUser">Add User</el-button>
		</div>
	</el-form>
</template>

<style scoped>
.form-container {
	margin: 0 15px;
	margin-top: 20px;
	width: 500px;
}
.align-end {
	text-align: end;
}
@media (max-width: 520px) {
	.el-form {
		width: 220px;
	}
}
</style>
