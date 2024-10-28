<script setup>
import { ref, computed, onMounted, useTemplateRef } from 'vue';
import { ElForm, ElInput, ElButton, ElFormItem } from 'element-plus';
import { $api } from '../../lib/api';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid';
import { formRules } from '../constants';
import { $route, $router } from '../../lib/router/router';

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
const isEdit = computed(() => $route.value.name === 'edit-storage');

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
	$router.push({ name: 'storage-details', params: { id: storage.value.id } });
	$notify({
		title: 'Canceled',
		message: 'Storage editing canceled',
		type: 'info'
	});
	formEl.value.resetFields();
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
		$router.push({ name: 'storage-details', params: { id: storage.value.id } });
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating storage');
	}
};

const toggleEdit = () => {
	$router.push({ name: 'edit-storage', params: { id: storage.value.id } });
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
				<el-input v-model="storage.room" :disabled="!isEdit" />
			</el-form-item>
			<el-form-item label="Name" prop="name">
				<el-input v-model="storage.name" :disabled="!isEdit" />
			</el-form-item>
			<el-form-item label="Description" prop="description">
				<el-input v-model="storage.description" :disabled="!isEdit" />
			</el-form-item>
			<div v-if="!isEdit">
				<el-button @click="toggleEdit">Edit</el-button>
			</div>
			<div v-else>
				<el-button @click="cancelEdit">Cancel</el-button>
				<el-button type="primary" @click="handleSubmit">Save</el-button>
			</div>
		</el-form>
	</div>
</template>

<style scoped>
.wrapper {
	margin-top: 20px;
}
</style>
