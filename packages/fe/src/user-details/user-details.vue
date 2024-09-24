<script setup>
import { ElForm, ElInput, ElButton, ElFormItem } from 'element-plus';
import {  ref } from 'vue';
const editingForm = ref(false);
const repeat_password = ref('');
const user = ref({
	// test values
	username: 'annabee',
  firstname: 'Anna',
  lastname: 'Smith',
  email: 'annasmith@gmail.com',
	role: 'Admin',
	password: 'testing!',
	creation_date: '12.04.22'
});
const toggleEdit = () => {
  editingForm.value = !editingForm.value;
  if (!editingForm.value) {
    // API calls later
  }
};

const cancelEdit = () => {
  editingForm.value = false;
};

</script>

<template>
		<div class="wrapper">
			<h1>User Details</h1>
			<el-form :model="user" @submit.prevent="toggleEdit">
        <el-form-item>Username:
				<el-input v-model="user.username" :disabled="true" />
			</el-form-item>
        <el-form-item>First name:
        <el-input v-model="user.firstname" :disabled="!editingForm" />
			</el-form-item>
        <el-form-item>Last name:
        <el-input v-model="user.lastname" :disabled="!editingForm" />
			</el-form-item>
        <el-form-item>Email:
        <el-input v-model="user.email" :disabled="!editingForm" />
			</el-form-item>
        <el-form-item>Role:
        <el-input v-model="user.role" :disabled="!editingForm" />
			</el-form-item>
        <el-form-item>Password:
        <el-input v-model="user.password" type="password" :disabled="!editingForm" />
        <el-input
          v-if="editingForm"
          v-model="repeat_password"
          type="password"
          placeholder="Repeat password"
        />
			</el-form-item>
        <el-form-item>Creation date:
				<el-input v-model="user.creation_date" :disabled="true" />
			</el-form-item>
      <el-button  type="primary" @click="toggleEdit">{{ editingForm ? 'Save' : 'Edit profile' }}</el-button>
      <el-button v-if="editingForm" @click="cancelEdit">Cancel</el-button>
    </el-form>
		</div>
</template>

<style scoped>
.wrapper {
	color: black;
}

</style>
