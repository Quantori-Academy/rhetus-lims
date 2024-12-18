<script setup>
import { computed, nextTick, onMounted, ref, useTemplateRef } from 'vue';
import { ElInput, ElForm, ElFormItem } from 'element-plus';
import { $route, $router } from '../../lib/router/router.js';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { $api } from '../../lib/api/index.js';
import { formRef, formRules } from './constants.js';
import SubstanceManagement from './substance-management.vue';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid.js';
import { onBeforeRouteLeave } from 'vue-router';
import { __ } from '../../lib/locales/index.js';
import { $confirm } from '../../lib/utils/feedback/confirm-msg.js';

const formEl = useTemplateRef('form-el');
const isSaving = ref(false);
const loading = ref(false);
const form = ref(formRef);
const rules = ref(formRules);
const linkedRequests = ref([]);
const isReagentPending = ref(false);
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
		$notifyUserAboutError(error);
	} finally {
		loading.value = false;
	}
};
const linkRequest = selectedRequest => {
	if (!linkedRequests.value.find(req => req.id === selectedRequest.id)) {
		const selected = {
			...selectedRequest
		};
		linkedRequests.value.push(selected);
		form.value.reagentRequests.push({
			...selected
		});
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
const addNewReagent = async substance => {
	const newSub = {
		...substance,
		name: substance.reagentName
	};
	form.value.newReagents = [...form.value.newReagents, newSub];
};
const addExistingReagent = async substance => {
	form.value.reagents = [...form.value.reagents, substance];
};
const removeReagent = (id, type) => {
	let target;
	if (type === 'reagents') {
		target = form.value.reagents;
	} else if (type === 'newReagents') {
		target = form.value.newReagents;
	}
	if (target) {
		const index = target.findIndex(item => item.id === id);
		if (index !== -1) {
			target.splice(index, 1);
		} else {
			$notifyUserAboutError(`Item not found`);
		}
	} else {
		$notifyUserAboutError(`Array for type '${type}' not found`);
	}
};
async function submit() {
	try {
		if (!(await $isFormValid(formEl))) return;
		if (isReagentPending.value) {
			await $confirm(
				__(`You didn't add the filled-out reagent to the list, are you sure you want to proceed?`),
				'Warning',
				{
					confirmButtonText: 'OK',
					type: 'warning'
				}
			);
		}
		isSaving.value = true;
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
		if (!['cancel', 'close'].includes(error)) {
			$notifyUserAboutError(error);
		}
	} finally {
		isSaving.value = false;
	}
}
const resetForm = () => {
	form.value.reagents = [];
	form.value.reagentRequests = [];
	form.value.newReagents = [];
	linkedRequests.value = [];
	form.value = { ...formRef };
	if (formEl.value) {
		formEl.value.resetFields();
	}
};

const cancelForm = async () => {
	resetForm();
	await nextTick();
	if (isRequest.value) {
		$router.push({ name: 'orders-list' });
	} else {
		$router.push({ name: 'substances-list' });
	}
};
onBeforeRouteLeave((to, from, next) => {
	resetForm();
	next();
});
const updateItem = ({ id, type, field, newValue }) => {
	let reagentToUpdate;
	if (type === 'reagentRequests') {
		reagentToUpdate = form.value.reagentRequests.find(item => item.id === id);
	} else if (type === 'reagents') {
		reagentToUpdate = form.value.reagents.find(item => item.id === id);
	} else if (type === 'newReagents') {
		reagentToUpdate = form.value.newReagents.find(item => item.id === id);
	}
	if (reagentToUpdate) {
		reagentToUpdate[field] = newValue;
	} else {
		$notifyUserAboutError(`Item not found`);
	}
};
const validateReagentPending = status => {
	isReagentPending.value = status;
};
</script>

<template>
	<div class="wrapper">
		<el-form ref="form-el" :model="form" :rules="rules" label-width="auto" label-position="top">
			<el-form-item :label="__('Title')" prop="title">
				<el-input v-model="form.title" :placeholder="__('Enter title')" />
			</el-form-item>
			<el-form-item :label="__('Seller')" prop="seller">
				<el-input v-model="form.seller" :placeholder="__('Enter seller name')" />
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
				@submit="submit"
				@cancel-form="cancelForm"
				@update-item="updateItem"
				@validate-reagent-pending="validateReagentPending"
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
.add-btn,
.el-input-number {
	width: 100%;
}

.orders-container,
.requests,
.linked-requests-container,
.el-form {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.el-input-group__append,
.linked-requests-container,
.el-form-item__content {
	gap: 10px;
}

.el-form-item__content {
	gap: 10px;
	width: 100%;
}

.btn-container {
	display: flex;
	gap: 1rem;
}
.row__order_creation {
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
	.row__order_creation {
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
