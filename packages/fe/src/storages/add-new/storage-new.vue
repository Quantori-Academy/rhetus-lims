<script setup>
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton, ElAutocomplete } from 'element-plus';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $router } from '../../lib/router/router.js';
import { $api } from '../../lib/api/index.js';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid';
import { formRules } from '../constants';

const formEl = useTemplateRef('form-ref');
const storage = ref({
	room: '',
	name: '',
	description: ''
});
const rules = ref(formRules);
const rooms = ref([]);

const resetForm = () => {
	storage.value = {
		room: '',
		name: '',
		description: ''
	};
};

const cancelHandler = () => {
	resetForm();
	$router.push({ name: 'storages-list' });
};
const addStorage = async () => {
	if (!(await $isFormValid(formEl))) {
		$notifyUserAboutError('Error submitting form');
		return;
	}

	try {
		const response = await $api.storages.addStorage(storage.value);
		$notify({ message: response.message, type: 'success' });
		$router.push({ name: 'storages-list' });
	} catch (error) {
		$notifyUserAboutError(error);
	}
};

const setRooms = async () => {
	try {
		const data = await $api.storages.fetchStoragesRooms();

		rooms.value = formatRooms(data);
	} catch (error) {
		$notifyUserAboutError(error);
	}
};
const formatRooms = storages => {
	return storages.map(room => ({
		value: room,
		label: room
	}));
};
const filteredRooms = computed(() => {
	return rooms.value;
});
onMounted(() => {
	setRooms();
});
</script>

<template>
	<div class="wrapper">
		<el-form ref="form-ref" label-position="top" :model="storage" :rules="rules">
			<el-form-item label="Room" prop="room">
				<el-autocomplete
					v-model="storage.room"
					:fetch-suggestions="filteredRooms"
					placeholder="Enter room"
				/>
			</el-form-item>
			<el-form-item label="Name" prop="name">
				<el-input v-model="storage.name" placeholder="Enter name" />
			</el-form-item>
			<el-form-item label="Description" prop="description">
				<el-input v-model="storage.description" type="textarea" placeholder="Enter description" />
			</el-form-item>
			<div class="btn-container">
				<el-button @click="cancelHandler">Cancel</el-button>
				<el-button type="primary" @click="addStorage">Add Storage</el-button>
			</div>
		</el-form>
	</div>
</template>
