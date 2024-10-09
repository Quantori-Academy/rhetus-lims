<script setup>
import { ref, useTemplateRef } from 'vue';
import { rules, validate } from '../helpers';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $router } from '../../lib/router/router.js';
import { $api } from '../../lib/api/index.js';

const formEl = useTemplateRef('form-ref');
const storage = ref({
	room: '',
	name: ''
});

const resetForm = () => {
	storage.value = {
		room: '',
		name: ''
	};
};

const cancelHandler = () => {
	resetForm();
	$router.push({ name: 'storages-list' });
};
const addStorage = async () => {
	if (!(await validate(formEl))) return;
	try {
		const response = await $api.storages.addStorage(storage.value);
		$notify({ message: response.message, type: 'success' });
		$router.push({ name: 'storages-list' });
	} catch (error) {
		$notifyUserAboutError(error);
	}
};
</script>

<template>
	<div class="wrapper">
		<h1>Add Storage Location</h1>
		<el-form ref="form-ref" label-position="top" :model="storage" :rules="rules">
			<el-form-item label="Room" prop="room">
				<el-input v-model="storage.room"></el-input>
			</el-form-item>
			<el-form-item label="Name" prop="name">
				<el-input v-model="storage.name"></el-input>
			</el-form-item>
			<el-button @click="cancelHandler">Cancel</el-button>
			<el-button type="primary" @click="addStorage">Save</el-button>
		</el-form>
	</div>
</template>
