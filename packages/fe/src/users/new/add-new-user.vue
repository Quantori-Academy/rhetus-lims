<script setup>
import { ref, useTemplateRef, onMounted } from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton, ElSelect, ElOption } from 'element-plus';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $router } from '../../lib/router/router.js';
import { $api } from '../../lib/api/index.js';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid.js';
import { __ } from '../../lib/locales/index.js';

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

const requiredRule = { required: true, message: __('Required field'), trigger: ['blur', 'change'] };
const rules = ref({
	username: [requiredRule],
	email: [{ required: true, type: 'email', message: __('Required field') }],
	password: [
		requiredRule,
		{
			min: 8,
			message: __('Password must be at least 8 characters long'),
			trigger: ['blur', 'change']
		}
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
	} finally {
		isSaving.value = false;
	}
}

async function setRoles() {
	try {
		roles.value = await $api.users.getRoles();
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
	<div class="wrapper">
		<el-form ref="form-ref" :rules="rules" label-position="top" :model="form">
			<el-form-item :label="__('Username')" prop="username">
				<el-input v-model="form.username" :placeholder="__('Enter username')"></el-input>
			</el-form-item>
			<el-form-item :label="__('First name')" prop="name">
				<el-input v-model="form.firstName" :placeholder="__('Enter first name')"></el-input>
			</el-form-item>
			<el-form-item :label="__('Last name')" prop="lastname">
				<el-input v-model="form.lastName" :placeholder="__('Enter last name')"></el-input>
			</el-form-item>
			<el-form-item :label="__('Email')" prop="email">
				<el-input v-model="form.email" :placeholder="__('Enter email')"></el-input>
			</el-form-item>
			<el-form-item :label="__('Password')" prop="password">
				<el-input
					v-model="form.password"
					:placeholder="__('Enter password')"
					type="password"
					show-password
				></el-input>
			</el-form-item>
			<el-form-item :label="__('Role')" prop="role">
				<el-select v-model="form.roleId" :placeholder="__('Select role')">
					<el-option
						v-for="role of roles"
						:key="role.id"
						:label="role.name"
						:value="role.id"
					></el-option>
				</el-select>
			</el-form-item>
			<div class="btn-container">
				<el-button @click="cancelHandler">{{ __('Cancel') }}</el-button>
				<el-button :loading="isSaving" type="primary" @click="addUser">{{
					__('Add User')
				}}</el-button>
			</div>
		</el-form>
	</div>
</template>

<style scoped>
.el-button {
	margin: 0 0 12px 12px;
}
</style>
