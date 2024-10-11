<script setup>
import { ref, onMounted, computed, useTemplateRef } from 'vue';
import { ElForm, ElInput, ElButton, ElFormItem } from 'element-plus';
import { $api } from '../../lib/api';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $router } from '../../lib/router/router';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid';
import { rules } from '../constants';

const storage = ref(null);
const isLoading = ref(false);
const initialStorage = ref(null);
const formEl = useTemplateRef('form-ref');

const props = defineProps({
	id: {
		type: String,
		default: null
	}
});

const setStorage = async id => {
	isLoading.value = true;
	try {
		const storageData = await $api.storages.fetchStorage(id);
		storage.value = storageData;
		initialStorage.value = { ...storageData };
	} catch (error) {
		$notifyUserAboutError(error);
	}
	isLoading.value = false;
};

const cancelEdit = () => {
	$router.push({ name: 'storages-list' });
};

const isFormChanged = computed(() => {
	return (
		storage.value.room !== initialStorage.value.room ||
		storage.value.name !== initialStorage.value.name ||
		storage.value.description !== initialStorage.value.description
	);
});

const handleSubmit = async () => {
	try {
		if (!isFormChanged.value) {
			$notify({
				title: 'Notification',
				message: 'There is nothing to update',
				type: 'info'
			});
			return;
		}

		if (!(await $isFormValid(formEl))) {
			$notifyUserAboutError('Error submitting form');
			return;
		}

		const response = await $api.storages.updateStorage(storage.value.id, storage.value);
		$notify({
			title: 'Success',
			message: response.message,
			type: 'success'
		});
		$router.push({ name: 'storages-list' });
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating storage');
	}
};

onMounted(() => {
	setStorage(props.id);
});
</script>

<template>
	<div class="wrapper">
		<h1>Storage Location Edit</h1>
		<el-form
			v-if="storage && !isLoading"
			ref="form-ref"
			label-position="top"
			:model="storage"
			:rules="rules"
			@submit="handleSubmit"
		>
			<el-form-item label="Room" prop="room">
				<el-input v-model="storage.room"></el-input>
			</el-form-item>
			<el-form-item label="Name" prop="name">
				<el-input v-model="storage.name"></el-input>
			</el-form-item>
			<el-form-item label="Description" prop="description">
				<el-input v-model="storage.description"></el-input>
			</el-form-item>
			<el-button @click="cancelEdit">Cancel</el-button>
			<el-button type="primary" @click="handleSubmit">Save</el-button>
		</el-form>
	</div>
</template>
