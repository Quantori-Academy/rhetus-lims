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
	ElOption,
	ElMessageBox
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
import TimelineStatuses from '../timeline/timeline-statuses.vue';

const props = defineProps({ id: { type: String, default: null } });

const { isOfficer } = inject('user');
const loading = ref(false);
const request = ref(emptyRequest);
const isEdit = computed(() => $route.value.name === 'request-details-edit');
const user = inject('user');

const showPoMessage = computed(
	() => request.value.status === Statuses.CANCELED && request.value.poComment && !isEdit.value
);
const statusesHistory = ref(null);
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
		const response = await $api.requests.updateRequest(request.value.id, request.value);
		$notify({
			title: response.status.charAt(0).toUpperCase() + response.status.slice(1),
			message: response.message || __('Request has been updated'),
			type: response.status
		});

		$router.push({ name: 'request-details', params: { id: request.value.id } });
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating request');
	}
};

const cancelRequest = async () => {
	try {
		await $confirm('Are you sure you want to cancel the request?', 'Please, confirm your action', {
			confirmButtonText: 'Yes',
			cancelButtonText: 'No',
			type: 'warning'
		});
		await ElMessageBox.prompt('Please, provide a reason', 'Warning', {
			confirmButtonText: 'Ok',
			cancelButtonText: 'Cancel',
			inputPattern: /\S+/,
			inputErrorMessage: 'Reason is required'
		}).then(({ value }) => {
			const response = $api.requests.cancelRequest(props.id, { reason: value });
			$notify({ title: 'Success', message: response.message, type: 'success' });
		});
		setRequest(props.id);
		setStatusesHistory();
	} catch (error) {
		if (!['cancel', 'close'].includes(error)) {
			$notifyUserAboutError(error);
		}
	}
};

const setStatusesHistory = async () => {
	loading.value = true;
	try {
		const data = await $api.requests.fetchRequestsHistory(props.id);
		statusesHistory.value = data.histories;
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error getting history');
	} finally {
		loading.value = false;
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
				<el-button
					type="primary"
					:disabled="request.status !== Statuses.PENDING"
					@click="toggleEdit"
					>{{ __('Edit') }}</el-button
				>
				<el-button
					v-if="isOfficer"
					type="danger"
					:disabled="request.status !== Statuses.PENDING"
					@click="cancelRequest"
				>
					{{ __('Cancel Request') }}
				</el-button>
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
					:disabled="!isEdit || !(request.author.username === user?.user?.value?.username)"
				/>
			</el-form-item>
			<el-form-item :label="__('Procurement Comments')" prop="poComment">
				<el-input v-model="request.poComment" type="textarea" :disabled="!isEdit || !isOfficer" />
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
		<timeline-statuses
			v-if="!isEdit"
			:statuses-history="statusesHistory"
			@set-statuses-history="setStatusesHistory"
		/>
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

.el-button.el-button--primary.is-disabled,
.el-button.el-button--primary.is-disabled:hover {
	border-color: #92d6ee;
	background-color: #92d6ee;
}
</style>
