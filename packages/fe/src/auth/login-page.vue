<script setup>
import { ElForm, ElInput, ElButton, ElFormItem } from 'element-plus';
import { inject, onMounted, ref } from 'vue';
import { $api } from '../lib/api/index.js';
import { $notify, $notifyUserAboutError } from '../lib/utils/feedback/notify-msg.js';
import { $router } from '../lib/router/router.js';

const { login, isAuthorized } = inject('auth');

function createDefaultFormValues() {
	return {
		username: '',
		password: ''
	};
}

const form = ref(createDefaultFormValues());
const isLoading = ref(false);

async function onSubmit() {
	isLoading.value = true;

	try {
		const response = await $api.auth.login(form.value);
		const userData = await $api.users.fetchCurrentUserInfo();
		login(userData);
		$notify({
			title: 'Success',
			message: response.message,
			type: 'success'
		});
		$router.push({ name: 'dashboard' });
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		isLoading.value = false;
	}
}

onMounted(() => {
	if (isAuthorized.value) $router.push({ name: 'dashboard' });
});
</script>

<template>
	<div class="logo-container">
		<img width="56" height="56" src="../lib/assets/images/logo.svg" alt="" />
		<div class="logo-title">Rhetus Lims</div>
	</div>

	<div class="form-container">
		<el-form :model="form" label-position="top" class="form" @keyup.enter="onSubmit">
			<el-form-item label="Username">
				<el-input v-model="form.username" class="input" />
			</el-form-item>
			<el-form-item label="Password">
				<el-input v-model="form.password" type="password" class="input" show-password />
			</el-form-item>
			<el-form-item>
				<div class="forgot-password">
					<router-link to="/reset-password">Forgot your password?</router-link>
				</div>
			</el-form-item>
			<el-form-item>
				<el-button :loading="isLoading" type="primary" @click="onSubmit"> Sign In </el-button>
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
		color: var(--el-color-primary);
		line-height: 1;

		a {
			padding: 4px;
			border-radius: 4px;
			color: inherit;
			&:focus,
			&:focus-visible {
				box-shadow:
					0 0 0 1px var(--rh-color-page-white),
					0 0 0 3px var(--rh-color-primary-600);
				outline: none;
			}
		}
	}

	.el-button {
		width: 100%;
	}
}
</style>
