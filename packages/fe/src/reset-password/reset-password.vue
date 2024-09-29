<script setup>
import { ElForm, ElInput, ElLink, ElButton, ElFormItem, } from 'element-plus';
import { ref } from 'vue';
import { $api } from '../lib/api/index.js';
import { $notifyUserAboutError } from '../../src/lib/utils/feedback/notify-msg.js';

function createDefaultFormValues() {
	return {
		username: '',
		password: '',

	};
}

const users = ref([]);
const form = ref(createDefaultFormValues());

async function setUsers() {

	try {
		users.value = await await $api.users.fetchUsers();
		console.log(users.value);
	} catch (error) {
		$notifyUserAboutError(error);
	}

}

async function login(form) {
	const token = await await $api.loginUser.getBearerToken(form.username, form.password);
	if (token) {
		const userData = await await $api.loginUser.fetchUser(token, form.username);
		if (userData) {
			console.log("User Data:", userData);
		}
	}
}
function onSubmit() {
	console.log('submit');
	form.value = createDefaultFormValues();
	login(form.value);
	
}
</script>

<template>
	<div class="wrapper">
		<el-form :model="form" label-width="auto">
			<el-form-item label="Username">
				<el-input v-model="form.username" />
			</el-form-item>
			<el-form-item label="New Password">
				<el-input
                    v-model="form.password"
                    type="password"
                    
                />        
			</el-form-item>
		    
			<el-form-item>
				<el-button type="primary" @click="onSubmit">
					Change Password
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
