<script setup>
import { ElForm, ElInput, ElButton, ElFormItem, ElSelect, ElOption } from 'element-plus';
import { $notifyUserAboutError, $notify } from '../lib/utils/feedback/notify-msg';
import { computed, onMounted } from 'vue';
import { ref } from 'vue';

const editingForm = ref(false);
const formRef = ref(null);
const user = ref(null);
const originalUser = ref(null);
const loading = ref(true);
const rules = ref({
	firstName: [{ required: true, message: "First name can't be empty" }],
	lastName: [{ required: true, message: "Last name can't be empty", trigger: 'change' }],
	email: [
		{ required: true, message: "Email can't be empty" },
		{ type: 'email', message: 'Please input a valid email address', trigger: 'blur' }
	]
});

onMounted(() => {
	retrieveUser('c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d');
});

const retrieveUser = async id => {
	try {
		const response = await fetch(`/api/users/${id}`);
		if (!response.ok) {
			$notifyUserAboutError(response.message || 'Error updating user');
		}
		const data = await response.json();
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

const handleSubmit = async () => {
	const valid = await new Promise(resolve => {
		formRef.value?.validate(valid => {
			resolve(valid);
		});
	});
	if (!formHasChanges.value) {
		toggleEdit();
		return;
	}
	if (!valid) {
		return;
	}

	try {
		const response = await fetch(`/api/users/${user.value.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user.value)
		});
		const updatedUser = await response.json();
		user.value = updatedUser;
		originalUser.value = { ...updatedUser };
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating user');
	}
	toggleEdit();
};

const changePassword = async () => {
	try {
		$notify({
			title: 'Success',
			message: 'Password change request has been sent',
			type: 'success'
		});
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
			ref="formRef"
			:model="user"
			:rules="rules"
			@submit.prevent="handleSubmit"
		>
			<el-form-item prop="username"
				>Username
				<el-input v-model="user.username" :disabled="true" />
			</el-form-item>
			<el-form-item prop="firstName"
				>First name
				<el-input v-model="user.firstName" :disabled="!editingForm" />
			</el-form-item>
			<el-form-item prop="lastName"
				>Last name
				<el-input v-model="user.lastName" :disabled="!editingForm" />
			</el-form-item>
			<el-form-item prop="email"
				>Email
				<el-input v-model="user.email" :disabled="!editingForm" />
			</el-form-item>
			<el-form-item
				>Role
				<el-select v-model="user.role" :disabled="!editingForm" :placeholder="user.role">
					<el-option label="Admin" value="admin" />
					<el-option label="Procurement officer" value="procurement_officer" />
					<el-option label="Researcher" value="researcher" />
				</el-select>
			</el-form-item>
			<el-form-item class="last-input" prop="creationDate"
				>Creation date
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
