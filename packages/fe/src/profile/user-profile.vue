<script setup>
import {ref} from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';

const profile = ref({
	username: 'JoSm',
	firstName: 'John',
	lastName: 'Smith',
	email: 'john.smith@mail.com',
	password: 'password',
	role: 'Admin'
});

const editable = ref(false);

const onProfileEdit = () => {
	editable.value = !editable.value
};

</script>

<template>
	<div class="profile">
		<h1>Profile</h1>
		<el-form class="el-form" label-position="top" >
			<el-form-item label="Username">
				<el-input v-model="profile.username" readonly=true :disabled="editable" />
			</el-form-item>
			<el-form-item label="First name">
				<el-input v-model="profile.firstName" :readonly=!editable />
			</el-form-item>
			<el-form-item label="Last name">
				<el-input v-model="profile.lastName" :readonly=!editable />
			</el-form-item>
			<el-form-item label="Email">
				<el-input v-model="profile.email" :readonly=!editable />
			</el-form-item>
			<el-form-item label="Password">
				<el-input v-model="profile.password" type="password" :readonly=!editable />
			</el-form-item>
			<el-form-item label="Role">
				<el-input v-model="profile.role" readonly=true :disabled=editable />
			</el-form-item>

			<el-form-item>
				<el-button :type="editable ? 'default' : 'primary'" @click="onProfileEdit">{{ editable ? 'Cancel' : 'Edit' }}</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<style scoped>
.profile {
	margin: 0 15px;

	h1 {
		color: #080808;
		margin-bottom: 1rem;
	}
}

.el-form {
	width: 400px;
}

@media (max-width: 520px) {
	.el-form {
		width: 220px;
	}
}

</style>
