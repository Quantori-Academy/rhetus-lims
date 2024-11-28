<script setup>
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import { ElInput, ElForm, ElFormItem } from 'element-plus';
import { $route, $router } from '../../lib/router/router.js';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $api } from '../../lib/api/index.js';
import { formRef, formRules } from './constants.js';
import SubstanceManagement from './substance-management.vue';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid.js';

const formEl = useTemplateRef('form-el');
const isSaving = ref(false);
const loading = ref(false);
const form = ref(formRef);
const rules = ref(formRules);
const linkedRequests = ref([]);
const isRequest = computed(() => $route.value.name === 'new-order-request');

onMounted(() => {
	const targetId = $route.value.query.id;
	if (targetId) {
		fetchSubstances(targetId);
	}
});

const fetchSubstances = async id => {
	loading.value = true;
	try {
		const reagentData = await $api.substances.fetchSubstance('reagent', id);
		const newReagent = {
			reagentName: reagentData.name,
			quantityUnit: reagentData.quantityUnit,
			quantity: reagentData.quantity,
			amount: reagentData.amount || 1
		};
		form.value.reagents = [...form.value.reagents, newReagent];
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error fetching reagent');
	} finally {
		loading.value = false;
	}
};
const linkRequest = selectedRequest => {
	if (!linkedRequests.value.find(req => req.id === selectedRequest.id)) {
		const selected = {
			...selectedRequest,
			name: selectedRequest.reagentName
		};
		linkedRequests.value.push(selected);
		form.value.reagentRequests.push(selected);
	}
};
const removeLinkedRequest = async selectedReagent => {
	const index = form.value.reagentRequests.findIndex(req => req.id === selectedReagent.id);
	if (index !== -1) {
		form.value.reagentRequests.splice(index, 1);
	}
	const linkedIndex = linkedRequests.value.findIndex(req => req.id === selectedReagent.id);
	if (linkedIndex !== -1) {
		linkedRequests.value.splice(linkedIndex, 1);
	}
};
const addNewReagent = async newSubstance => {
	form.value.newReagents.push({
		reagentName: newSubstance.name,
		quantityUnit: newSubstance.quantityUnit,
		quantity: newSubstance.quantity,
		amount: newSubstance.amount,
		casNumber: '',
		producer: '',
		catalogId: '',
		catalogLink: '',
		unitPrice: null,
		description: '',
		structure: ''
	});
};
const addExistingReagent = async newSubstance => {
	form.value.reagents.push({
		...newSubstance,
		id: newSubstance.id,
		quantityUnit: newSubstance.quantityUnit,
		quantity: newSubstance.quantity,
		amount: newSubstance.amount
	});
};
function removeReagent(index) {
	if (index !== -1) {
		form.value.reagents.splice(index, 1);
	}
}

async function submit() {
	if (!(await $isFormValid(formEl))) return;
	isSaving.value = true;
	try {
		const body = {
			title: form.value.title,
			seller: form.value.seller,
			reagents: [...form.value.reagents],
			reagentRequests: [...form.value.reagentRequests],
			newReagents: [...form.value.newReagents]
		};
		const response = await $api.orders.addOrder(body);
		$notify({ message: response.message, type: 'success' });
		$router.push({ name: 'orders-list' });
	} catch (error) {
		$notifyUserAboutError(error.statusText);
	} finally {
		isSaving.value = false;
		formEl.value.resetFields();
		form.value = { ...formRef };
	}
}
function cancelForm() {
	formEl.value.resetFields();
	if (isRequest.value) {
		$router.push({ name: 'orders-list' });
	} else {
		$router.push({ name: 'substances-list' });
	}
}

form.value.reagents.forEach(item => (item.type = 'reagent'));
form.value.newReagents.forEach(item => (item.type = 'newReagent'));
form.value.reagentRequests.forEach(item => (item.type = 'reagentRequest'));

const bulkUpdate = async newOrders => {
	if (!(await $isFormValid(formEl))) return;
	newOrders.forEach(group => {
		const type = group.type;
		const addedItems = form.value[type];
		const index = addedItems.findIndex(item => item.id === group.id);
		if (index !== -1) {
			addedItems[index] = { ...addedItems[index], ...group };
		}
	});
	submit();
	console.log('ITEMS ADDED', form.value);
};

const handleUpdateItem = ({ index, type, field, newValue }) => {
	if (type === 'reagentRequests') {
		form.value.reagentRequests[index][field] = newValue;
	} else if (type === 'reagents') {
		form.value.reagents[index][field] = newValue;
	} else if (type === 'newReagents') {
		form.value.newReagents[index][field] = newValue;
	}
};
</script>

<template>
	<div class="wrapper">
		<el-form ref="form-el" :model="form" :rules="rules" label-width="auto" label-position="top">
			<el-form-item label="Title" prop="title">
				<el-input v-model="form.title" placeholder="Enter title" />
			</el-form-item>
			<el-form-item label="Seller" prop="seller">
				<el-input v-model="form.seller" placeholder="Enter seller name" />
			</el-form-item>
			<substance-management
				:form="form"
				:is-request="isRequest"
				:linked-requests="linkedRequests"
				@add-new-reagent="addNewReagent"
				@add-existing-reagent="addExistingReagent"
				@remove-reagent="removeReagent"
				@remove-request="removeLinkedRequest"
				@link-request="linkRequest"
				@bulk-update="bulkUpdate"
				@cancel-form="cancelForm"
				@update-item="handleUpdateItem"
			/>
		</el-form>
	</div>
</template>

<style>
.requests-table,
.btn-container {
	margin-top: 20px;
}
.el-form,
.add-btn {
	width: 100%;
}

.orders-container,
.requests,
.linked-requests-container {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.el-input-group__append,
.linked-requests-container,
.el-form-item__content {
	gap: 10px;
}
.el-form {
	display: flex;
	flex-direction: column;
	gap: 10px;
}
.el-input-number {
	width: 100%;
}
.orders-container {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.el-form-item__content {
	gap: 10px;
	width: 100%;
}
.data-table {
	margin-top: 20px;
	width: 100%;
}
.btn-container {
	display: flex;
	gap: 1rem;
}
.row {
	display: grid;
	grid-template-rows: auto auto;
	grid-template-columns: repeat(4, 1fr) 0.1fr;
	column-gap: 8px;
	color: var(--rh-color-info-700);
}

.linked {
	grid-row: 2;
	grid-column: 1 / -1;
	width: 100%;
	font-weight: 500;
}
.desktop {
	display: none;
}
@media (max-width: 820px) {
	.row {
		grid-template-columns: repeat(2, 1fr);
		.mobile {
			display: block;
		}
		.mobile {
			display: none;
		}
		.desktop {
			display: inline-block;
		}
		.linked {
			grid-row: 1;
			grid-column: 1 / -1;
		}
		.linked .el-tag {
			width: 100%;
		}
	}
}
</style>
