<script setup>
import { ElForm, ElInput, ElButton, ElFormItem } from 'element-plus';
import { ref } from 'vue';
import { $api } from '../lib/api/index.js';
import { $notify, $notifyUserAboutError } from '../lib/utils/feedback/notify-msg.js';
import { $router } from '../lib/router/router.js';

function createDefaultFormValues() {
	return {
		username: '',
		password: ''
	};
}

const form = ref(createDefaultFormValues());
const isLoading = ref(false);

async function login(form) {
	isLoading.value = true;

	try {
		const response = await $api.auth.login(form);
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
function onSubmit() {
	login(form.value);
}
</script>

<template>
	<div class="container">
		<div class="login-form">
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
						<el-input v-model="form.password" type="password" class="input" />
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
		</div>
	</div>
</template>

<style scope>
.container {
	display: flex;
	justify-content: center;
	align-items: flex-start;
	padding-top: 160px;
	height: 100vh;
}

.login-form {
	margin: 0 20px;
	width: 100%;
	max-width: 465px;
}

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
