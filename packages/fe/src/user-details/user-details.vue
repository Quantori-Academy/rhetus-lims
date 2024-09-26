<script setup>
import { ElForm, ElInput, ElButton, ElFormItem, ElSelect, ElOption, ElMessage } from 'element-plus';
// import { $api } from '../lib/api';
import '/src/lib/assets/stylesheets/colors.css';
// refs
import { ref } from 'vue';
const editingForm = ref(false);
const formRef = ref(null);
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// test values
const user = ref({
	username: 'annabee',
	firstName: 'Anna',
	lastName: 'Smith',
	email: 'annasmith@gmail.com',
	role: 'Admin',
	creationDate: '12.04.22'
});
// make original user copy
const originalUser = ref({ ...user.value });
// validation rules
onMounted(() => {
	const userId = route.params.id;
	console.log(userId);
	// Fetch user details based on the userId
});
const rules = ref({
	firstName: [{ required: true, message: "First name can't be empty" }],
	lastName: [{ required: true, message: "Last name can't be empty" }],
	email: [
		{ required: true, message: "Email can't be empty" },
		{ type: 'email', message: 'Please input a valid email address', trigger: 'blur' }
	]
});

// toggle edit form
const toggleEdit = () => {
	editingForm.value = !editingForm.value;
};

// cancel editing
const cancelEdit = () => {
	editingForm.value = false;
	user.value = { ...originalUser.value };
};
// handle form submission
const handleSubmit = async () => {
	try {
		// Validate the form
		const valid = await formRef.value.validate();
		if (valid) {
			originalUser.value = { ...user.value };
			//Ready to submit to API
			toggleEdit();
			// update user details with API
			// const response = await $api.users.updateUser(user.value);
			// console.log("User updated:", response);
			// originalUser.value = { ...user.value };
			// cancelEdit();
		}
	} catch (error) {
		console.error('Error updating user:', error);
	}
};
// toggle edit or form submission
const handleButtonClick = () => {
	if (editingForm.value) {
		// compare new values with original values
		const hasChanges =
			user.value.firstName !== originalUser.value.firstName ||
			user.value.lastName !== originalUser.value.lastName ||
			user.value.email !== originalUser.value.email ||
			user.value.role !== originalUser.value.role;
		if (hasChanges) {
			handleSubmit();
		} else {
			// There is nothing to submit
			toggleEdit();
		}
	} else {
		toggleEdit();
	}
};

//  request password change
const changePassword = async () => {
	try {
		// Suggestion: add additional check that the password change for this user was really made
		// const response = await $api.users.updatePasswordChange({ username: user.value.username, mustChangePassword: true });
		// console.log("Password change request sent:", response);

		// a success message
		ElMessage({ message: 'Password change request has been set!', type: 'success' });
	} catch (error) {
		console.error('Error requesting password change:', error);
	}
};
</script>

<template>
	<div class="wrapper">
		<h1>User Details</h1>
		<el-form ref="formRef" :model="user" :rules="rules" @submit.prevent="handleButtonClick">
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
			<el-button type="primary" @click="handleButtonClick">{{
				editingForm ? 'Save' : 'Edit profile'
			}}</el-button>
			<el-button v-if="editingForm" @click="cancelEdit">Cancel</el-button>
			<el-button v-if="!editingForm" type="warning" @click="changePassword"
				>Change password</el-button
			>
		</el-form>
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
