<script setup>
import { ElForm, ElInput, ElButton, ElFormItem, ElSelect, ElOption } from 'element-plus';
import { $notifyUserAboutError, $notify } from '../lib/utils/feedback/notify-msg';
import { $confirm } from '../lib/utils/feedback/confirm-msg.js/';
import { computed, onMounted, useTemplateRef } from 'vue';
import { ref } from 'vue';
import { $api } from '../lib/api/index.js';

const editingForm = ref(false);
const formEl = useTemplateRef('form-ref');
const user = ref(null);
const originalUser = ref(null);
const loading = ref(true);
const props = defineProps({
	id: {
		type: String,
		default: null
	}
});
const rules = ref({
	firstName: [{ required: true, message: "First name can't be empty" }],
	lastName: [{ required: true, message: "Last name can't be empty", trigger: 'change' }],
	email: [
		{ required: true, message: "Email can't be empty" },
		{ type: 'email', message: 'Please input a valid email address', trigger: 'blur' }
	]
});

onMounted(() => {
	setUser(props.id);
});
const setUser = async id => {
	try {
		const data = await $api.users.fetchUser(id);
		user.value = data;
		originalUser.value = { ...data };
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating user');
	} finally {
		loading.value = false;
	}
};
const formHasChanges = computed(() => {
	if (!originalUser.value) return false;
	return (
		user.value.firstName !== originalUser.value.firstName ||
		user.value.lastName !== originalUser.value.lastName ||
		user.value.email !== originalUser.value.email ||
		user.value.role !== originalUser.value.role
	);
});

const toggleEdit = () => {
	editingForm.value = !editingForm.value;
};

const cancelEdit = () => {
	editingForm.value = false;
	user.value = { ...originalUser.value };
};
async function validate() {
	return formEl.value.validate();
}

const confirmRoleChange = async () => {
	if (user.value.role !== originalUser.value.role) {
		try {
			const confirmed = await $confirm(
				`Are you sure you want to change the role to ${user.value.role}?`,
				'Confirm Role Change',
				{
					confirmButtonText: 'Yes, Change Role',
					cancelButtonText: 'Cancel',
					type: 'warning'
				}
			);
			return confirmed;
		} catch (error) {
			$notifyUserAboutError(error.message || 'Role update canceled');
			return false;
		}
	}
	return true;
};
const handleSubmit = async () => {
	if (!formHasChanges.value) {
		toggleEdit();
		return;
	}
	const valid = await validate();
	if (!valid) return;
	try {
		const updatedUser = await $api.users.updateUser(user.value.id, user.value);
		user.value = updatedUser;
		originalUser.value = { ...updatedUser };
		$notify({
			title: 'Success',
			message: 'Profile has been updated',
			type: 'success'
		});
		toggleEdit();
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating user');
	}
};
const changePassword = async () => {
	try {
		const confirmed = await $confirm(
			'Are you sure you want to change your password?',
			'Confirm Password Change',
			{
				confirmButtonText: 'Yes',
				cancelButtonText: 'No',
				type: 'warning'
			}
		);
		if (confirmed) {
			const response = await $api.users.changePassword(user.value.id, true);
			console.log(response);
			$notify({
				title: 'Success',
				message: 'Password change request has been sent',
				type: 'success'
			});
		}
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error requesting password change');
	}
};
</script>

<template>
	<div class="wrapper">
		<h1>User Details</h1>
		<el-form
			v-if="user && !loading"
			ref="form-ref"
			label-position="top"
			:model="user"
			:rules="rules"
			@submit="handleSubmit"
		>
			<el-form-item label="Username" prop="username">
				<el-input v-model="user.username" :disabled="true" />
			</el-form-item>
			<el-form-item label="First name" prop="firstName">
				<el-input v-model="user.firstName" :disabled="!editingForm" />
			</el-form-item>
			<el-form-item label="Last name" prop="lastName">
				<el-input v-model="user.lastName" :disabled="!editingForm" />
			</el-form-item>
			<el-form-item label="Email" prop="email">
				<el-input v-model="user.email" :disabled="!editingForm" />
			</el-form-item>
			<el-form-item label="Role">
				<el-select
					v-model="user.role"
					:disabled="!editingForm"
					:placeholder="user.role"
					@change="confirmRoleChange"
				>
					<el-option label="Admin" value="admin" />
					<el-option label="Procurement officer" value="procurement_officer" />
					<el-option label="Researcher" value="researcher" />
				</el-select>
			</el-form-item>
			<el-form-item class="last-input" label="Creation date" prop="creationDate">
				<el-input v-model="user.creationDate" :disabled="true" />
			</el-form-item>
			<el-button v-if="editingForm" type="primary" @click="handleSubmit">{{ '		Save' }}</el-button>
			<el-button v-else type="primary" @click="toggleEdit">{{ 'Edit profile' }}</el-button>
			<el-button v-if="editingForm" @click="cancelEdit">Cancel</el-button>
			<el-button v-if="!editingForm" type="warning" @click="changePassword"
				>Change password</el-button
			>
		</el-form>
		<div v-else>Loading user data...</div>
	</div>
</template>

<style scoped>
.wrapper {
	color: black;
}
.el-form-item {
	margin-bottom: 10px;
}
.el-form {
	width: 50vw;
}
.el-form-item:last-of-type {
	margin-bottom: 20px;
}
.el-form-item .el-input.is-disabled .el-input__wrapper,
.el-form-item .el-select .el-select__wrapper.is-disabled {
	background-color: transparent;
}
@media screen and (max-width: 750px) {
	.el-form {
		width: 80vw;
	}
}
</style>
