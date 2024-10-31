<script setup>
import { ref, onMounted, useTemplateRef } from 'vue';
import { ElForm, ElInput, ElButton, ElFormItem } from 'element-plus';
import { $api } from '../../lib/api';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $router } from '../../lib/router/router';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid';
import { formRules } from '../constants';

const props = defineProps({
	id: {
		type: String,
		default: null
	}
});
const storage = ref(null);
const isLoading = ref(false);
const formEl = useTemplateRef('form-ref');
const rules = ref(formRules);

const setStorage = async id => {
	isLoading.value = true;
	try {
		const storageData = await $api.storages.fetchStorage(id);
		storage.value = storageData;
	} catch (error) {
		$notifyUserAboutError(error);
	}
	isLoading.value = false;
};

const cancelEdit = () => {
	$router.push({ name: 'storages-list' });
};

const handleSubmit = async () => {
	try {
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
	<div v-loading="isLoading" class="wrapper">
		<el-form
			v-if="storage"
			ref="form-ref"
			label-position="top"
			:model="storage"
			:rules="rules"
			@submit="handleSubmit"
		>
			<el-form-item label="Room" prop="room">
				<el-input v-model="storage.room" />
			</el-form-item>
			<el-form-item label="Name" prop="name">
				<el-input v-model="storage.name" />
			</el-form-item>
			<el-form-item label="Description" prop="description">
				<el-input v-model="storage.description" type="textarea" />
			</el-form-item>
			<div class="btn-container">
				<el-button @click="cancelEdit">Cancel</el-button>
				<el-button type="primary" @click="handleSubmit">Save</el-button>
			</div>
		</el-form>
	</div>
</template>
