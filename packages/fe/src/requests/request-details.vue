<script setup>
import {
	ElForm,
	ElTag,
	ElInput,
	ElButton,
	ElFormItem,
	ElDatePicker,
	ElInputNumber,
	ElSelect,
	ElOption
} from 'element-plus';
import { computed, ref, onMounted, inject } from 'vue';
import { $notifyUserAboutError, $notify } from '../lib/utils/feedback/notify-msg.js';
import { $confirm } from '../lib/utils/feedback/confirm-msg.js';
import { $api } from '../lib/api/index.js';
import { $route, $router } from '../lib/router/router.js';
import { emptyRequest, Statuses } from './constants.js';
import { getButtonType } from '../orders/details/constants.js';
import { quantityUnits } from '../lib/constants/quantity-units.js';
import KetcherEditor from '../ketcher-editor/ketcher-editor.vue';
import { __ } from '../lib/locales/index.js';

const props = defineProps({ id: { type: String, default: null } });

const { isOfficer, isResearcher } = inject('user');

const loading = ref(false);
const request = ref(emptyRequest);
const isEdit = computed(() => $route.value.name === 'request-details-edit');

const showPoMessage = computed(
	() => request.value.status === Statuses.CANCELED && request.value.poComment && !isEdit.value
);

const toggleEdit = () => {
	$router.push({ name: 'request-details-edit', params: { id: request.value.id } });
};

async function setRequest(id) {
	loading.value = true;

	try {
		request.value = await $api.requests.fetchRequest(id);
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error fetching request');
	} finally {
		loading.value = false;
	}
}

const cancelEdit = () => {
	$router.push({ name: 'request-details', params: { id: request.value.id } });
};

const handleSubmit = async () => {
	try {
		await $api.requests.updateRequest(request.value.id, request.value);
		$notify({
			title: 'Success',
			message: 'Request has been updated',
			type: 'success'
		});

		$router.push({ name: 'request-details', params: { id: request.value.id } });
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating request');
	}
};

const deleteRequest = async () => {
	try {
		await $confirm('Do you want to delete this request?', 'Warning', {
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel',
			type: 'warning'
		});
		await $api.requests.cancelRequest(props.id);
		$notify({
			title: 'Success',
			message: 'Request has been deleted',
			type: 'success'
		});
		$router.push({ name: 'requests-list' });
	} catch (error) {
		if (!['cancel', 'close'].includes(error)) {
			$notifyUserAboutError(error);
		}
	}
};

onMounted(() => {
	setRequest(props.id);
});
</script>

<template>
	<div class="wrapper">
		<div class="editing-header">
			<h2>
				<span v-if="request.reagentName">
					{{ request.reagentName }}
					<el-tag :type="getButtonType(request.status)" round>
						{{ request.status }}
					</el-tag>
				</span>
			</h2>
			<div v-if="!isEdit && request.status !== Statuses.CANCELED" class="top-button-container">
				<el-button type="primary" @click="toggleEdit">{{ __('Edit') }}</el-button>
				<el-button type="danger" @click="deleteRequest"> {{ __('Cancel Request') }} </el-button>
			</div>
		</div>
		<div v-if="showPoMessage" class="po-message">
			<span class="po-message-prefix">{{ __('Procurement Officer comment') }}:</span>
			{{ request.poComment }}
		</div>
		<el-form
			ref="form-ref"
			v-loading="loading"
			label-position="top"
			:model="request"
			@submit="handleSubmit"
		>
			<el-form-item :label="__('Reagent name')" prop="reagentName">
				<el-input v-model="request.reagentName" :disabled="!isEdit" />
			</el-form-item>
			<el-form-item :label="__('Structure')" prop="structure">
				<ketcher-editor
					v-model:smiles="request.structure"
					:disabled="!isEdit"
					:placeholder="__('Enter structure')"
				/>
			</el-form-item>
			<el-form-item :label="__('CAS number')" prop="casNumber">
				<el-input
					v-model="request.casNumber"
					:disabled="!isEdit"
					:placeholder="__('Indicate CAS number')"
				/>
			</el-form-item>
			<div class="align-horizontal">
				<el-form-item :label="__('Quantity')" prop="quantity">
					<el-input-number v-model="request.quantity" :min="1" :disabled="!isEdit" />
				</el-form-item>
				<el-form-item :label="__('Quantity unit')" prop="quantityUnit">
					<el-select
						v-model="request.quantityUnit"
						:disabled="!isEdit"
						filterable
						:placeholder="__('Select unit')"
					>
						<el-option v-for="unit of quantityUnits" :key="unit" :label="unit" :value="unit" />
					</el-select>
				</el-form-item>
				<el-form-item :label="__('Amount')" prop="status">
					<el-input-number v-model="request.amount" :min="1" :disabled="!isEdit" />
				</el-form-item>
			</div>
			<el-form-item :label="__('User Comments')" prop="userComment">
				<el-input
					v-model="request.userComment"
					type="textarea"
					:disabled="!isEdit || isResearcher"
				/>
			</el-form-item>
			<el-form-item :label="__('Procurement Comments')" prop="poComment">
				<el-input v-model="request.poComment" type="textarea" :disabled="!isEdit || isOfficer" />
			</el-form-item>
			<div class="align-horizontal">
				<el-form-item :label="__('Creation Date')" prop="createdAt">
					<el-date-picker
						v-model="request.createdAt"
						type="datetime"
						format="YYYY-MM-DD"
						:disabled="true"
					/>
				</el-form-item>
				<el-form-item :label="__('Update Date')" prop="updatedAt">
					<el-date-picker
						v-model="request.updatedAt"
						type="datetime"
						format="YYYY-MM-DD"
						:disabled="true"
					/>
				</el-form-item>
			</div>
			<div v-if="isEdit" class="btn-container">
				<el-button type="primary" @click="handleSubmit">{{ __('Save') }}</el-button>
				<el-button @click="cancelEdit">{{ __('Cancel') }}</el-button>
			</div>
		</el-form>
	</div>
</template>

<style scoped>
.el-form-item {
	margin-bottom: 10px;
}
.el-form-item:last-of-type {
	margin-bottom: 20px;
}
.btn-container {
	display: flex;
	gap: 10px;
}

.top-button-container {
	display: flex;
	gap: 10px;
}

.po-message {
	margin-bottom: 8px;
	padding: 8px;
	width: 100%;
	border-radius: 4px;
	background: var(--el-color-danger-light-8);

	.po-message-prefix {
		font-weight: 500;
	}
}
</style>
