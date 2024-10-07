<script setup>
import { ElForm, ElInput, ElLink, ElButton, ElFormItem, } from 'element-plus';
import { ref } from 'vue';
import { $api } from '../lib/api/index.js';
import { $notifyUserAboutError, $notify } from '../../src/lib/utils/feedback/notify-msg.js';

function createDefaultFormValues() {
	return {
		username: '',
	};
}

const form = ref(createDefaultFormValues());


async function resetPassword(form) {
	try {
		const user = await $api.auth.resetUserPassword(form.username);
		$notify({
			title: 'Success',
			message: 'Password reset successfully',
			type: 'success'
		});
	} catch (error) {
		$notifyUserAboutError(error);
	}
	
}

function onSubmit() {
	console.log('submit');
	resetPassword(form.value = createDefaultFormValues());
}
</script>

<template>
	<div class="wrapper">
		<el-form :model="form" label-width="auto">
			<el-form-item label="Username">
				<el-input v-model="form.username" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">
					Reset Password
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
