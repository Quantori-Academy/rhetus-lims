<script setup>
import { ElForm, ElInput, ElButton, ElFormItem } from 'element-plus';
import { ref, useTemplateRef } from 'vue';
import { $api } from '../lib/api/index.js';
import { $router } from '../lib/router/router';
import { $notifyUserAboutError, $notify } from '../lib/utils/feedback/notify-msg.js';
import { __ } from '../lib/locales/';
import { $isFormValid } from '../lib/utils/form-validation/is-form-valid.js';

function createDefaultFormValues() {
	return {
		username: ''
	};
}
const usernameRule = fieldName => {
	return { required: true, message: `${fieldName} can't be empty`, trigger: 'submit' };
};
const formEl = useTemplateRef('formEl');
const form = ref(createDefaultFormValues());
const isLoading = ref(false);

async function resetPassword(form) {
	isLoading.value = true;

	try {
		const response = await $api.auth.requestPasswordReset(form);
		$notify({
			title: 'Success',
			message: response.message,
			type: 'success'
		});
		formEl.value.resetFields();
		$router.push({ name: 'login' });
	} catch (error) {
		const { data } = error;
		$notifyUserAboutError(data.message);
	} finally {
		isLoading.value = false;
	}
}

async function onSubmit() {
	if (!(await $isFormValid(formEl))) return;
	resetPassword(form.value);
}
</script>

<template>
	<div class="logo-container">
		<img width="56" height="56" src="../lib/assets/images/logo.svg" alt="" />
		<div class="logo-title">{{ __('Rhetus Lims') }}</div>
	</div>

	<div class="form-container">
		<el-form
			ref="formEl"
			:model="form"
			label-position="top"
			class="form"
			@submit.prevent
			@keyup.enter="onSubmit"
		>
			<el-form-item :label="__('Username')" prop="username" :rules="usernameRule('Username')">
				<el-input v-model="form.username" class="input" :placeholder="__('Enter username')" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">{{ __('Reset password') }}</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<style scope>
.logo-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 20px;

	.logo-title {
		margin-top: 20px;
		font-weight: 700;
		font-size: 20px;
	}
}

.form-container {
	width: 100%;
}

.form {
	.forgot-password {
		display: flex;
		justify-content: end;
		width: 100%;

		a {
			color: inherit;
		}
	}

	.el-button {
		width: 100%;
	}
}
</style>
