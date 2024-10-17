<script setup>
import { ElForm, ElInput, ElButton, ElFormItem } from 'element-plus';
import { ref } from 'vue';
import { $api } from '../../lib/api/index.js';
import { $notifyUserAboutError, $notify } from '../../lib/utils/feedback/notify-msg.js';

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
		const response = await $api.auth.resetUserPassword(form.username);
		$notify({
			title: 'Success',
			message: response.message,
			type: 'success'
		});
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
	<div class="container">
		<div class="login-form">
			<div class="logo-container">
				<img width="56" height="56" src="../../lib/assets/images/logo.svg" alt="" />
				<div class="logo-title">Rhetus Lims</div>
			</div>

			<div class="form-container">
				<el-form
					:model="form"
					label-position="top"
					class="form"
					@submit.prevent
					@keyup.enter="onSubmit"
				>
					<el-form-item label="Username">
						<el-input v-model="form.username" class="input" />
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmit"> Reset Password </el-button>
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
