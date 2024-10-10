<script setup>
import { ElForm, ElInput, ElButton, ElFormItem, ElSelect, ElOption } from 'element-plus';
import { $notifyUserAboutError, $notify } from '../../lib/utils/feedback/notify-msg';
import { $confirm } from '../../lib/utils/feedback/confirm-msg.js/';
import { computed, onMounted, useTemplateRef } from 'vue';
import { ref } from 'vue';
import { $api } from '../../lib/api/index.js';
import { $router } from '../../lib/router/router';
import { useRoute } from 'vue-router';
import { formatDate } from '../../lib/utils/datetime/date-format.js';

const editingForm = ref(false);
const formEl = useTemplateRef('form-ref');
const reagent = ref(null);
const loading = ref(true);

const props = defineProps({
	id: {
		type: String,
		default: null
	},
	isEdit: {
		type: Boolean,
		default: false
	}
});

const route = useRoute();

const isEdit = computed(() => {
	return props.isEdit || route.query.isEdit === 'true';
});

onMounted(() => {
	setReagent(props.id);
	editingForm.value = isEdit.value;
});

const rules = ref({
	quantityLeft: [{ required: true, message: "Quantity left can't be empty" }],
	storageLocation: [
		{ required: true, message: "Storage location can't be empty", trigger: 'change' },
		{
			validator: (_, value, callback) => {
				if (!value.name || value.name.trim() === '') {
					callback(new Error("Storage location can't be empty"));
				} else {
					callback();
				}
			},
			trigger: 'change'
		}
	]
});

const setReagent = async id => {
	try {
		const data = await $api.reagents.fetchReagent(id);
		reagent.value = { ...data };
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating reagent');
	} finally {
		loading.value = false;
	}
};

const toggleEdit = () => {
	editingForm.value = !editingForm.value;
	$router.push({
		name: 'reagent-details',
		params: { id: reagent.value.id },
		query: { isEdit: true }
	});
};

const cancelEdit = () => {
	editingForm.value = false;
	setReagent(props.id);
	$router.push({ name: 'reagent-details', params: { id: props.id } });
};

async function validate() {
	return formEl.value.validate();
}

const handleSubmit = async () => {
	const valid = await validate();
	if (!valid) return;
	try {
		const updatedReagent = await $api.reagents.updateReagent(reagent.value.id, reagent.value);
		reagent.value = updatedReagent;
		$notify({
			title: 'Success',
			message: 'Reagent has been updated',
			type: 'success'
		});
		toggleEdit();
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating reagent');
	}
};

const deleteReagent = async () => {
	cancelEdit();
	try {
		await $confirm('Do you want to delete this reagent?', 'Warning', {
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel',
			type: 'warning'
		});
		const response = await $api.reagents.deleteReagent(props.id);
		$notify({
			title: 'Success',
			message: response.message,
			type: 'success'
		});
		await $router.push({ name: 'reagents-list' });
	} catch {
		$notify({
			title: 'Canceled',
			message: 'Reagent deletion canceled',
			type: 'info'
		});
	}
};
</script>

<template>
	<div class="reagent-details">
		<h1>Reagent Details</h1>
		<el-form
			v-if="reagent && !loading"
			ref="form-ref"
			label-position="top"
			:model="reagent"
			:rules="rules"
			@submit="handleSubmit"
		>
			<el-form-item label="Expiration date" prop="expirationDate">
				<span> {{ reagent.id }}</span>
			</el-form-item>
			<el-form-item label="Name" prop="name">
				<el-input v-model="reagent.name" :disabled="true" />
			</el-form-item>
			<el-form-item label="Category">
				<el-select v-model="reagent.category" :disabled="true" :placeholder="reagent.category">
					<el-option label="Reagent" value="reagent" />
					<el-option label="Sample" value="sample" />
				</el-select>
			</el-form-item>
			<el-form-item label="Description" prop="description">
				<el-input v-model="reagent.description" :disabled="true" />
			</el-form-item>
			<el-form-item label="CAS number" prop="casNumber">
				<el-input v-model="reagent.casNumber" :disabled="true" />
			</el-form-item>
			<el-form-item label="Producer" prop="producer">
				<el-input v-model="reagent.producer" :disabled="true" />
			</el-form-item>
			<el-form-item label="Catalog ID" prop="catalogId">
				<el-input v-model="reagent.catalogId" :disabled="true" />
			</el-form-item>
			<el-form-item label="Catalog link" prop="catalogLink">
				<el-input v-model="reagent.catalogLink" :disabled="true" />
			</el-form-item>
			<el-form-item label="Storage location" prop="storageLocation">
				<el-input v-model="reagent.storageLocation.name" :disabled="!editingForm" />
			</el-form-item>
			<el-form-item label="Quantity left" prop="quantityLeft">
				<el-input v-model="reagent.quantityLeft" :disabled="!editingForm" />
			</el-form-item>
			<el-form-item label="Quantity" prop="quantity">
				<el-input v-model="reagent.quantity" :disabled="true" />
			</el-form-item>
			<el-form-item label="Unit" prop="quantityUnit">
				<el-input v-model="reagent.quantityUnit" :disabled="true" />
			</el-form-item>
			<el-form-item label="Price per unit" prop="unitPrice">
				<el-input v-model="reagent.unitPrice" :disabled="true" />
			</el-form-item>
			<el-form-item label="Expiration date" prop="expirationDate">
				<span> {{ formatDate(reagent.expirationDate) }}</span>
			</el-form-item>
			<el-button v-if="editingForm" type="primary" @click="handleSubmit">{{ 'Save' }}</el-button>
			<el-button v-else type="primary" @click="toggleEdit">{{ 'Edit reagent' }}</el-button>
			<el-button v-if="editingForm" @click="cancelEdit">Cancel</el-button>
			<el-button type="danger" @click="deleteReagent">{{ 'Delete reagent' }}</el-button>
		</el-form>
		<div v-else>Loading reagent data...</div>
	</div>
</template>

<style scoped>
.reagent-details {
	display: flex;
	flex-direction: column;
	gap: 5rem;
	padding-bottom: 5rem;
	width: 50vw;
	color: black;
}
.reagent-details :deep(.el-input__wrapper),
.reagent-details :deep(.el-select__wrapper) {
	background-color: transparent;
}
.quantity-unit-wrapper {
	display: flex;
	flex-direction: row;
	gap: 10px;
}
</style>
