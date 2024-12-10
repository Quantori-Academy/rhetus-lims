<script setup>
import { ref, defineProps, watch } from 'vue';
import { ElButton, ElSelect, ElOption, ElInputNumber } from 'element-plus';
import RhIcon from '../../../lib/components/rh-icon.vue';
import { __ } from '../../../lib/locales';

const props = defineProps({
	futureQuantity: { type: Number, default: null },
	componentOptions: { type: Object, default: null },
	resetSelects: { type: Boolean, default: false },
	form: { type: Object, default: null }
});
const selectedOption = ref(null);
const selectedQuantity = ref(0);
const emit = defineEmits([
	'add-component',
	'filter-components',
	'is-option-chosen',
	'get-selected-option',
	'get-selected-quantity'
]);

watch(
	() => selectedOption.value,
	newVal => {
		emit('get-selected-option', newVal);
	}
);

watch(
	() => selectedQuantity.value,
	newVal => {
		emit('get-selected-quantity', newVal);
	}
);
watch(
	() => props.resetSelects,
	() => {
		selectedOption.value = null;
		selectedQuantity.value = 0;
	}
);
const addComponent = () => emit('add-component');
const filterComponents = query => emit('filter-components', query);
const isOptionChosen = option => {
	return props.form.components.some(component => component.id === option.id);
};
</script>

<template>
	<div class="grid-container-samples">
		<div class="input-row">
			<el-select
				v-model="selectedOption"
				value-key="id"
				filterable
				remote
				:remote-method="filterComponents"
				:placeholder="__('Select a component to add')"
			>
				<el-option
					v-for="item of props.componentOptions"
					:key="item.id"
					:label="`${item.label}`"
					:value="item"
					:disabled="isOptionChosen(item)"
				>
					<div class="category-icons">
						<rh-icon :name="item.category.toLowerCase() === 'reagent' ? 'pod' : 'applications'" />
						<span>{{ item.label }}</span>
					</div>
				</el-option>
			</el-select>
			<div class="w-full">
				<el-input-number
					v-model="selectedQuantity"
					:min="selectedOption ? 0.01 : 0"
					:max="selectedOption && selectedOption.quantity"
					:label="__('Quantity')"
					:placeholder="__('Enter quantity')"
					><template #suffix>
						<span>{{ selectedOption && selectedOption.quantityUnit }}</span>
					</template>
				</el-input-number>
				<div v-if="selectedOption" class="subscript">
					{{ __('Future quantity') }}:
					{{ props.futureQuantity }}
					{{ selectedOption ? selectedOption.quantityUnit : '' }}
				</div>
			</div>
		</div>
		<el-button
			class="button-row"
			type="primary"
			:disabled="selectedQuantity === 0"
			@click="addComponent"
		>
			<rh-icon color="white" name="plus" />
		</el-button>
	</div>
</template>

<style scoped>
.w-full {
	width: 100%;
}
:deep(.el-input-number) {
	width: 100%;
}
.el-form-item__content {
	gap: 10px;
}
.subscript {
	opacity: 0.6;
	font-size: small;
}
.grid-container-samples {
	grid-gap: 10px;
	display: grid;
	grid-template-rows: auto auto;
	grid-template-columns: 1fr 1fr;
	align-items: center;
	padding-bottom: 10px;
	width: 100%;
}
.input-row {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-column: 1 / -1;
	align-items: start;
	gap: 1rem;
}

.button-row {
	grid-column: 2;
	justify-self: end;
}
.category-icons {
	display: flex;
	align-items: center;
}
@media (max-width: 768px) {
	.grid-container-samples,
	.input-row {
		grid-template-columns: 1fr;
	}
	.button-row {
		grid-row: 2;
		grid-column: 1;
		justify-self: initial;
		width: 100%;
	}
	.w-full {
		margin-bottom: 12px;
	}
}
</style>
