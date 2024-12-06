<script setup>
import { ElForm, ElInput, ElButton, ElFormItem } from 'element-plus';
import { ref } from 'vue';
import { $api } from '../lib/api/index.js';
import { $router } from '../lib/router/router';
import { $notifyUserAboutError, $notify } from '../lib/utils/feedback/notify-msg.js';
import { __ } from '../lib/locales/';

function createDefaultFormValues() {
	return {
		username: ''
	};
}

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
		$router.push({ name: 'login' });
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		isLoading.value = false;
	}
}

function onSubmit() {
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
			:model="form"
			label-position="top"
			class="form"
			@submit.prevent
			@keyup.enter="onSubmit"
		>
			<el-form-item :label="__('Username')">
				<el-input v-model="form.username" class="input" />
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
