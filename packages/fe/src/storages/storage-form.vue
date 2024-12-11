<script setup>
import { onMounted, ref, useTemplateRef, computed, inject } from 'vue';
import { ElButton, ElForm, ElInput, ElFormItem, ElTooltip } from 'element-plus';
import { $api } from '../lib/api/index';
import { $confirm } from '../lib/utils/feedback/confirm-msg';
import { $notify, $notifyUserAboutError } from '../lib/utils/feedback/notify-msg.js';
import { $isFormValid } from '../lib/utils/form-validation/is-form-valid';
import { $route, $router } from '../lib/router/router.js';
import { emptyStorage, formRules } from './constants';
import { __ } from '../lib/locales/index.js';

const props = defineProps({
	id: {
		type: String,
		default: null
	}
});
const { isAdmin } = inject('user');
const storage = ref(emptyStorage);
const isLoading = ref(false);
const formEl = useTemplateRef('form-ref');
const rules = ref(formRules);
const isEdit = computed(() => $route.value.name === 'storage-details-edit');

async function fetchStorage(id) {
	isLoading.value = true;
	try {
		const data = await $api.storages.fetchStorage(id);
		storage.value = data;
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error getting storage location');
	} finally {
		isLoading.value = false;
	}
}

const cancelEdit = () => {
	$router.push({ name: 'storage-details' });
	$notify({
		title: 'Canceled',
		message: 'Storage editing canceled',
		type: 'info'
	});
	fetchStorage(props.id);
};

const updateStorage = async () => {
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
		$router.push({ name: 'storage-details' });
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating storage');
	}
};

async function deleteStorage() {
	try {
		await $confirm(
			'Are you sure you want to delete this storage location?',
			'Please, confirm your action',
			{
				confirmButtonText: 'Delete',
				cancelButtonText: 'Cancel',
				type: 'warning'
			}
		);

		const response = await $api.storages.deleteStorage(props.id);
		$notify({
			title: 'Success',
			message: response.message,
			type: 'success'
		});
		$router.push({ name: 'storages-list' });
	} catch (error) {
		if (['cancel', 'close'].includes(error)) {
			$notify({
				title: 'Canceled',
				message: 'Deletion canceled',
				type: 'info'
			});
		} else {
			$notifyUserAboutError(error.message);
		}
	}
}

const toggleEdit = () => {
	$router.push({ name: 'storage-details-edit', params: { id: storage.value.id } });
};

onMounted(() => {
	fetchStorage(props.id);
});
</script>

<template>
	<div class="wrapper">
		<div v-if="isAdmin" class="editing-header">
			{{ __('Storage') }}
			<el-button v-if="!isEdit" type="primary" @click="toggleEdit">{{
				__('Edit storage')
			}}</el-button>
		</div>
		<el-form
			ref="form-ref"
			v-loading="isLoading"
			label-position="top"
			:model="storage"
			:rules="rules"
			@submit="updateStorage"
		>
			<el-form-item :label="__('Room')" prop="room">
				<el-input v-model="storage.room" :disabled="!isEdit" />
			</el-form-item>
			<el-form-item :label="__('Name')" prop="name">
				<el-input v-model="storage.name" :disabled="!isEdit" />
			</el-form-item>
			<el-form-item :label="__('Description')" prop="description">
				<el-input
					v-model="storage.description"
					type="textarea"
					:placeholder="__('Enter description')"
					:disabled="!isEdit"
				/>
			</el-form-item>
			<template v-if="isEdit">
				<div class="btn-container">
					<el-button @click="cancelEdit">{{ __('Cancel') }}</el-button>
					<el-button type="primary" @click="updateStorage">{{ __('Save') }}</el-button>
				</div>
			</template>
			<template v-else>
				<div class="btn-container">
					<el-tooltip
						:disabled="storage.isEmpty"
						:content="__(`Can't delete, storage is not empty.`)"
						placement="top"
					>
						<el-button type="danger" :disabled="!storage.isEmpty" @click="deleteStorage">
							{{ __('Delete storage') }}
						</el-button>
					</el-tooltip>
				</div>
			</template>
		</el-form>
	</div>
</template>
