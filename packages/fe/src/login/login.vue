<script setup>
import { ElForm, ElInput, ElButton, ElFormItem, } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { $api } from '../lib/api/index.js';
import { $notify } from '../../src/lib/utils/feedback/notify-msg.js';

function createDefaultFormValues() {
	return {
		username: '',
		password: '',

	};
}

const form = ref(createDefaultFormValues());
const router = useRouter();

async function login(form) {
	try {
		const token = await $api.auth.login(form.value);
		if (token) {
			localStorage.setItem('token', token);
			const userData = await $api.auth.fetchUser(token, form.value);
			if (userData) {
				router.push({ name:'dashboard' });
			}
		}
	} catch (error) {
		$notify({
			title: 'Error',
			message: 'Incorrect Username or Password',
			type: 'Error'
		});
	}
	
}
function onSubmit() {
	console.log('submit');
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
