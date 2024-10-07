<script setup>
import { onMounted, ref, useTemplateRef } from 'vue';
import { $api } from '../lib/api';
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';
import { $notifyUserAboutError, $notify } from '../lib/utils/feedback/notify-msg';
import { router } from '../lib/router/router';

const editable = ref(false);
const profile = ref(null);
const initialData = ref(null);
const form = useTemplateRef('form');

const props = defineProps({
	id: {
		type: String,
		default: null
	}
});
const setProfile = async id => {
	try {
		const data = (profile.value = await $api.users.fetchUser(id));
		initialData.value = { ...data };
	} catch (err) {
		$notifyUserAboutError(err);
	}
};
const ifCancel = () => {
	profile.value = { ...initialData.value };
	editable.value = !editable.value;
};
const ifEdit = () => {
	editable.value = !editable.value;
};
const requiredRule = { required: true, message: 'Length should be at least 1', trigger: 'blur' };
const validation = ref({
	firstName: [requiredRule],
	lastName: [requiredRule],
	email: [
		{
			required: true,
			type: 'email',
			message: 'Please input correct email address',
			trigger: 'blur'
		}
	]
});
async function validate() {
	return form.value.validate();
}
const onProfileEdit = () => {
	if (editable.value) {
		ifCancel();
	} else {
		ifEdit();
	}
};
const editHandler = async () => {
	if (!(await validate())) return;
	try {
		await $api.users.updateUser(props.id, profile.value);
		editable.value = false;
		$notify({
			title: 'Success',
			message: 'Profile updated',
			type: 'success'
		});
	} catch (err) {
		$notifyUserAboutError(err);
	}
};
const passwordResetHandler = () => {
	router.push({ name: 'reset-password' });
};
onMounted(() => {
	setProfile(props.id);
});
</script>

<template>
	<div class="profile">
		<h1>Profile</h1>
		<el-form
			v-if="profile"
			ref="form"
			class="el-form"
			:model="profile"
			label-position="top"
			:rules="validation"
			@submit="editHandler"
		>
			<el-form-item label="Username" prop="username">
				<el-input v-model="profile.username" :readonly="true" :disabled="editable" />
			</el-form-item>
			<el-form-item label="First name" prop="firstName">
				<el-input v-model="profile.firstName" :readonly="!editable" />
			</el-form-item>
			<el-form-item label="Last name" prop="lastName">
				<el-input v-model="profile.lastName" :readonly="!editable" />
			</el-form-item>
			<el-form-item label="Email" prop="email">
				<el-input v-model="profile.email" :readonly="!editable" />
			</el-form-item>
			<el-form-item label="Role" prop="role">
				<el-input v-model="profile.role" :readonly="true" :disabled="editable" />
			</el-form-item>
			<el-form-item>
				<el-button :type="editable ? 'default' : 'primary'" @click="onProfileEdit">{{
					editable ? 'Cancel' : 'Edit'
				}}</el-button>
				<el-button v-if="editable" type="primary" @click="editHandler">Save</el-button>
				<el-button type="warning" @click="passwordResetHandler">Reset password</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<style scoped>
.profile {
	margin: 0 15px;
	h1 {
		margin-bottom: 1rem;
		color: #080808;
	}
}
.el-form {
	width: 500px;
}
@media (max-width: 520px) {
	.el-form {
		width: 220px;
	}
}
</style>
