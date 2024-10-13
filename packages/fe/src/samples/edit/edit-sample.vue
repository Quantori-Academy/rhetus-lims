<script setup>
import { onMounted, reactive, ref, useTemplateRef } from 'vue';
import {
	ElInput,
	ElForm,
	ElDatePicker,
	ElButton,
	ElFormItem,
	ElSelect,
	ElInputNumber,
	ElTag
} from 'element-plus';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg';
import { $deepClone } from '../../lib/utils/deep-clone/deep-clone';
import { $api } from '../../lib/api';
import { $confirm } from '../../lib/utils/feedback/confirm-msg';
import { $router } from '../../lib/router/router';

const props = defineProps({ id: { type: String, default: null } });

const formEl = useTemplateRef('form-el');
const originalSample = ref(null);
const editingSample = ref(null);

const requiredRule = {
	required: true,
	message: 'Please enter a value',
	trigger: ['blur', 'change']
};
const rules = reactive({
	quantityLeft: [
		requiredRule,
		{
			type: 'number',
			min: 0,
			message: "You can't add a sample that has none left",
			trigger: ['blur', 'change']
		}
	],
	storageLocation: {
		room: [requiredRule],
		cabinet: [requiredRule],
		shelf: [requiredRule]
	}
});

const isLoading = ref(true);
const isSaving = ref(false);
const isEditing = ref(false);

function sampleWasEdited(edited, original) {
	return !(
		edited.quantityLeft === original.quantityLeft &&
		edited.storageLocation.room === original.storageLocation.room &&
		edited.storageLocation.cabinet === original.storageLocation.cabinet &&
		edited.storageLocation.shelf === original.storageLocation.shelf
	);
}

async function deleteSample() {
	try {
		await $confirm('Are you sure you want to delete this sample?', 'Delete Sample?', {
			confirmButtonText: 'Delete',
			cancelButtonText: 'Cancel',
			type: 'warning'
		});
		try {
			const response = await $api.samples.deleteSample(props.id);
			$notify({
				title: 'Success',
				message: response.message,
				type: 'success'
			});
			$router.push({ name: 'dashboard' });
		} catch (error) {
			$notifyUserAboutError(error);
		}
	} catch (error) {
		$notify({
			title: 'Canceled',
			message: error.message || 'Sample deletion canceled',
			type: 'info'
		});
	}
}

async function submit() {
	if (!(await $isFormValid(formEl))) return;

	if (!sampleWasEdited(editingSample.value, originalSample.value)) {
		toggleEditingMode();
		return;
	}

	isSaving.value = true;

	try {
		const response = await $api.samples.updateSample(props.id, editingSample.value);
		$notify({ message: response.message, type: 'success' });
		originalSample.value = $deepClone(editingSample.value);
		isEditing.value = false;
	} catch (error) {
		$notifyUserAboutError(error.statusText);
	} finally {
		isSaving.value = false;
	}
}

function cancel() {
	isEditing.value = false;
	editingSample.value = $deepClone(originalSample.value);
}

function toggleEditingMode() {
	isEditing.value = !isEditing.value;
}

async function setSample(id) {
	try {
		const res = await $api.samples.fetchSample(id);
		originalSample.value = $deepClone(res);
		editingSample.value = $deepClone(res);
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		isLoading.value = false;
	}
}

onMounted(() => setSample(props.id));
</script>

<template>
	<div v-if="editingSample && !isLoading" class="container">
		<div class="header">
			<div>{{ `${isEditing ? 'Editing ' : ''}${editingSample.name}` }}</div>
			<el-button @click="toggleEditingMode">Edit</el-button>
		</div>
		<el-form
			ref="form-el"
			:model="editingSample"
			:rules="rules"
			label-width="auto"
			label-position="top"
		>
			<el-form-item label="Name" prop="name">
				<el-input v-model="editingSample.name" placeholder="Enter sample name" disabled />
			</el-form-item>
			<div class="reagents-container">
				<div class="label">Reagents/Samples used</div>
				<div class="tags">
					<el-tag v-for="item of editingSample.reagentsAndSamples" :key="item.id" type="info">
						<router-link
							class="link"
							target="_blank"
							:to="{ name: 'sample-details', params: { id: item.id } }"
						>
							{{ item.name }}
						</router-link>
					</el-tag>
				</div>
			</div>
			<div class="align-horizontal">
				<el-form-item label="Quantity unit" prop="quantityUnit">
					<el-select v-model="editingSample.quantityUnit" filterable disabled />
				</el-form-item>
				<el-form-item label="Size" prop="size">
					<el-input-number v-model="editingSample.size" placeholder="Enter amount" disabled>
						<template #suffix>
							{{ form.quantityUnit }}
						</template>
					</el-input-number>
				</el-form-item>
				<el-form-item label="Quantity left" prop="quantityLeft">
					<el-input-number
						v-model="editingSample.quantityLeft"
						placeholder="Enter amount"
						:disabled="!isEditing"
					>
						<template #suffix>
							{{ form.quantityUnit }}
						</template>
					</el-input-number>
				</el-form-item>
			</div>
			<el-form-item label="Expiration date" prop="expirationDate">
				<el-date-picker v-model="editingSample.expirationDate" type="date" disabled />
			</el-form-item>
			<div class="align-horizontal">
				<el-form-item label="Room" prop="storageLocation.room">
					<el-input
						v-model="editingSample.storageLocation.room"
						placeholder="Enter room"
						:disabled="!isEditing"
					/>
				</el-form-item>
				<el-form-item label="Cabinet" prop="storageLocation.cabinet">
					<el-input
						v-model="editingSample.storageLocation.cabinet"
						placeholder="Enter cabinet"
						:disabled="!isEditing"
					/>
				</el-form-item>
				<el-form-item label="Shelf" prop="storageLocation.shelf">
					<el-input
						v-model="editingSample.storageLocation.shelf"
						placeholder="Enter shelf"
						:disabled="!isEditing"
					/>
				</el-form-item>
			</div>
			<el-form-item label="Description" prop="description">
				<el-input
					v-model="editingSample.description"
					type="textarea"
					placeholder="Enter description"
					disabled
				/>
			</el-form-item>
			<div v-if="isEditing" class="btn-container">
				<el-button type="danger" @click="deleteSample">Delete</el-button>
				<div>
					<el-button @click="cancel">Cancel</el-button>
					<el-button :loading="isSaving" type="primary" @click="submit">Update</el-button>
				</div>
			</div>
		</el-form>
	</div>
	<div v-else class="title">Loading sample...</div>
</template>

<style>
.container {
	width: 42vw;
}
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12px;
	color: black;
	font-weight: 500;
	font-size: large;
}
.reagents-container {
	margin-bottom: 12px;
	.label {
		margin-bottom: 12px;
		color: #666;
	}
	.tags > * + * {
		margin-left: 8px;
	}
	.link {
		color: inherit;
		text-decoration: none;
	}
	.link:hover {
		color: var(--el-color-primary);
	}
}
.align-horizontal {
	display: flex;
	gap: 18px;
	.el-form-item {
		flex-grow: 1;
		flex-basis: 0;
	}
}
.btn-container {
	display: flex;
	justify-content: space-between;
}
.el-input-number {
	width: 100%;
}
.el-date-editor.el-input,
.el-date-editor.el-input__wrapper {
	width: 100%;
}
@media (max-width: 768px) {
	.container {
		padding-bottom: 24px;
		width: 80vw;
	}
	.align-horizontal {
		display: block;
	}
}
</style>
