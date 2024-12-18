<script setup>
import {
	ElForm,
	ElInput,
	ElButton,
	ElFormItem,
	ElSelect,
	ElOption,
	ElDatePicker,
	ElInputNumber
} from 'element-plus';
import { $notifyUserAboutError, $notify } from '../../lib/utils/feedback/notify-msg';
import { $promptInputBox } from '../../lib/utils/feedback/prompt-box';
import { computed, onMounted, useTemplateRef, ref, watch } from 'vue';
import { $api } from '../../lib/api/index.js';
import { $route, $router } from '../../lib/router/router';
import { formRules, emptyReagent, confirmNotify } from './constants.js';
import { checkEditedFields } from '../../substances/constants';
import { $isFormValid } from '../../lib/utils/form-validation/is-form-valid.js';
import TimelineHistory from '../../timeline/timeline-history.vue';
import RhIcon from '../../lib/components/rh-icon.vue';
import { __ } from '../../lib/locales/index.js';

const props = defineProps({
	id: {
		type: String,
		default: null
	},
	deleted: {
		type: Boolean,
		default: false
	}
});
const formEl = useTemplateRef('form-ref');
const reagent = ref(emptyReagent);
const loading = ref(true);
const isSaving = ref(false);
const storages = ref([]);
const isEdit = computed(() => $route.value.name === 'reagent-details-edit');
const isOutOfStock = computed(() => reagent.value.quantityLeft === 0);
const originalReagent = ref({});
const rules = ref(formRules);
const updatedReagentValues = ref({ category: 'reagent' });
const ketcherIFrame = ref(null);

watch(
	reagent,
	reagentFields => {
		updatedReagentValues.value = checkEditedFields(
			reagentFields,
			originalReagent,
			updatedReagentValues
		);
	},
	{ deep: true }
);

async function setStorages() {
	loading.value = true;
	try {
		storages.value = await $api.storages.fetchStorages({ limit: 999 });
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		loading.value = false;
	}
}

const generateImage = async structure => {
	const ketcher = ketcherIFrame.value.contentWindow.ketcher;
	let ketcherImage = null;
	try {
		ketcherImage = await ketcher.generateImage(structure, { outputFormat: 'svg' });
	} catch (error) {
		ketcherImage = null;
		console.log('Ketcher error', error);
	}
	return ketcherImage;
};

const setReagent = async () => {
	loading.value = true;
	try {
		const data = !props.deleted
			? await $api.substances.fetchSubstance('reagent', props.id)
			: await $api.substances.fetchDeletedSubstance('reagent', props.id);

		const ketcherImage = data.structure ? await generateImage(data.structure) : null;

		reagent.value = {
			...data,
			storageId: data.storageLocation.id,
			imageUrl: ketcherImage ? URL.createObjectURL(ketcherImage) : ''
		};
		originalReagent.value = { ...reagent.value };
	} catch (error) {
		$notifyUserAboutError(error.message || __('Error updating reagent'));
	} finally {
		loading.value = false;
	}
};
const toggleEdit = () => {
	$router.push({ name: 'reagent-details-edit', params: { id: reagent.value.id } });
};
const cancelEdit = () => {
	$router.push({ name: 'reagent-details', params: { id: reagent.value.id } });
	formEl.value.resetFields();
	setReagent();
};
const handleSubmit = async () => {
	if (!(await $isFormValid(formEl))) return;
	isSaving.value = true;
	try {
		await reasonQuantityChange();
		await checkReagentZero();
		const response = await $api.substances.updateSubstance(
			reagent.value.id,
			updatedReagentValues.value
		);
		$notify({
			title: __(response.status.charAt(0).toUpperCase() + response.status.slice(1)),
			message: response.message || __('Reagent has been updated'),
			type: response.status
		});
		routerChange();
	} catch (error) {
		if (!['cancel', 'close'].includes(error)) {
			$notifyUserAboutError(error.message || __('Error updating reagent'));
		}
	} finally {
		isSaving.value = false;
	}
};

const routerChange = () => {
	if (isOutOfStock.value) {
		$router.push({ name: 'substances-list' });
	} else {
		$router.push({ name: 'reagent-details', params: { id: reagent.value.id } });
		setReagent(props.id);
		updatedReagentValues.value = { category: 'reagent' };
	}
};

const reasonQuantityChange = async () => {
	if (updatedReagentValues.value.quantityUsed) {
		const reason = await $promptInputBox({
			message: __('Please, provide a reason for quantity change'),
			error: __('Reason is required')
		});
		updatedReagentValues.value.reason = reason.value;
	}
};
const checkReagentZero = async () => {
	if (isOutOfStock.value) {
		await confirmNotify(__('Quantity reached 0. Do you want to delete this reagent?'));
	}
};
const deleteReagent = async () => {
	try {
		await confirmNotify(__('Do you want to delete this reagent?'));
		const response = await $api.substances.deleteSubstance('reagent', props.id);
		$notify({ title: __('Success'), message: response.message, type: 'success' });
		await $router.push({ name: 'substances-list' });
	} catch (error) {
		if (!['cancel', 'close'].includes(error)) {
			this.$notifyUserAboutError(error);
		}
	}
};

onMounted(() => {
	if (ketcherIFrame.value) {
		ketcherIFrame.value.onload = () => {
			setReagent();
		};
	}
	setStorages();
});
</script>

<template>
	<div v-loading="loading" class="wrapper">
		<div class="editing-header">
			<div class="category-icons">
				<rh-icon name="pod" />{{ `${isEdit ? __('Editing') + ' ' : ''}${reagent.name}` }}
			</div>
			<el-button v-if="!isEdit && !props.deleted" @click="toggleEdit">{{ __('Edit') }}</el-button>
		</div>
		<el-form
			ref="form-ref"
			label-position="top"
			:model="reagent"
			:rules="rules"
			@submit="handleSubmit"
		>
			<div class="align-horizontal">
				<el-form-item :label="__('Name')" prop="name">
					<el-input v-model="reagent.name" :disabled="!isEdit" />
				</el-form-item>
				<el-form-item :label="__('Structure')" prop="structure">
					<div class="structure-img">
						<img
							v-if="reagent.imageUrl"
							:src="reagent.imageUrl"
							alt="Structure Image"
							width="120"
							height="120"
						/>
					</div>
				</el-form-item>
			</div>
			<div class="align-horizontal">
				<el-form-item :label="__('CAS number')" prop="casNumber">
					<el-input v-model="reagent.casNumber" :disabled="true" />
				</el-form-item>
				<el-form-item :label="__('Producer')" prop="producer">
					<el-input v-model="reagent.producer" :disabled="true" />
				</el-form-item>
			</div>
			<div class="align-horizontal">
				<el-form-item :label="__('Catalog ID')" prop="catalogId">
					<el-input v-model="reagent.catalogId" :disabled="true" />
				</el-form-item>
				<el-form-item :label="__('Catalog link')" prop="catalogLink">
					<el-input v-model="reagent.catalogLink" :disabled="true" />
				</el-form-item>
			</div>
			<div class="align-horizontal">
				<el-form-item :label="__('Quantity unit')" prop="quantityUnit">
					<el-input v-model="reagent.quantityUnit" :disabled="true" />
				</el-form-item>
				<el-form-item :label="__('Quantity')" prop="quantity">
					<el-input-number v-model="reagent.quantity" :disabled="true" />
				</el-form-item>
				<el-form-item :label="__('Quantity left')" prop="quantityLeft">
					<el-input-number
						v-model="reagent.quantityLeft"
						:placeholder="__('Enter amount')"
						:disabled="!isEdit"
						:min="0"
						:step="reagent.quantityLeft < 1 ? 0.01 : 1"
					>
					</el-input-number>
				</el-form-item>
			</div>
			<el-form-item :label="__('Price per unit')" prop="unitPrice">
				<el-input v-model="reagent.unitPrice" :disabled="true" />
			</el-form-item>
			<el-form-item :label="__('Expiration date')" prop="expirationDate">
				<el-date-picker
					v-model="reagent.expirationDate"
					type="date"
					format="YYYY-MM-DD"
					value-format="YYYY-MM-DD"
					disabled
				/>
			</el-form-item>
			<el-form-item :label="__('Storage location')" prop="storageId">
				<el-select v-model="reagent.storageId" :disabled="!isEdit" filterable>
					<el-option
						v-for="storage of storages"
						:key="storage.id"
						:label="`${storage.room} - ${storage.name}`"
						:value="storage.id"
					/>
				</el-select>
			</el-form-item>
			<el-form-item :label="__('Description')" prop="description">
				<el-input v-model="reagent.description" type="textarea" :disabled="!isEdit" />
			</el-form-item>
			<div v-if="isEdit" class="btns-container">
				<el-button type="danger" @click="deleteReagent">{{ __('Delete') }}</el-button>
				<div>
					<el-button @click="cancelEdit">{{ __('Cancel') }}</el-button>
					<el-button :loading="isSaving" type="primary" @click="handleSubmit">{{
						__('Update')
					}}</el-button>
				</div>
			</div>
		</el-form>
		<timeline-history
			v-if="!isEdit"
			:id="props.id"
			category="reagent"
			:is-deleted="props.deleted"
		/>
		<div class="ketcher-editor">
			<iframe
				ref="ketcherIFrame"
				src="/ketcher/index.html"
				width="100%"
				height="100%"
				frameborder="0"
				allowfullscreen
			></iframe>
		</div>
	</div>
</template>

<style scoped>
:deep(.el-date-editor) {
	width: 100%;
}

.ketcher-editor {
	display: none;
}

.structure-img {
	display: flex;
	justify-content: center;
	width: 100%;
}
</style>
