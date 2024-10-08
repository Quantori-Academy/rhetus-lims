<script setup>
import { ElForm, ElInput, ElButton, ElFormItem, } from 'element-plus';
import { ref } from 'vue';
import { router } from '../../lib/router/router.js';
import { $api } from '../lib/api/index.js';
import { $notify, $notifyUserAboutError } from '../../src/lib/utils/feedback/notify-msg.js';

function createDefaultFormValues() {
	return {
		username: '',
		password: '',

	};
}

const form = ref(createDefaultFormValues());

async function login(form) {
	try {
		const response = await $api.auth.login(form.value);
		$notify({
			title: 'Success',
			message: response.message,
			type: 'success'
		});
		router.push({ name: 'dashboard' });
	} catch (error) {
		$notifyUserAboutError(error);
	}
	
}
function onSubmit() {
	login(form.value);
}

</script>

<template>
	<div class="wrapper">
		<el-form :model="form" label-width="auto">
			<el-form-item label="Username">
				<el-input v-model="form.username" />
			</el-form-item>
			<el-form-item label="Password">
				<el-input v-model="form.password" type="password" />        
			</el-form-item>
		    <el-form-item>
				<router-link to="/reset-password">Reset Password</router-link>
			</el-form-item>	
			<el-form-item>
				<el-button type="primary" @click="onSubmit">
					Log In
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<style scoped>
.wrapper {
	display: grid;
	place-content: center;
	gap: 24px;
}

.icon {
	color: white;
}

.icon-container {
	margin-right: 4px;
}
</style>
