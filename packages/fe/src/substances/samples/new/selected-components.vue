<script setup>
import { ElInput, ElButton, ElInputNumber } from 'element-plus';
import RhIcon from '../../../lib/components/rh-icon.vue';
import { __ } from '../../../lib/locales';

const props = defineProps({
	futureQuantity: { type: Number, default: null },
	componentOptions: { type: Object, default: null },
	resetSelects: { type: Boolean, default: false },
	form: { type: Object, default: null }
});
const emit = defineEmits(['remove-component']);
const removeComponent = index => emit('remove-component', index);
</script>

<template>
	<div
		v-for="(component, index) of props.form.components"
		:key="component.id + index"
		class="grid-container-samples"
	>
		<div class="input-row">
			<el-input v-model="component.label" :placeholder="__('Add substance name')" disabled />
			<div>
				<el-input-number
					v-model="component.quantityUsed"
					:min="1"
					:max="component.quantity"
					:placeholder="__('Enter quantity')"
					><template #suffix>
						<span>{{ component.quantityUnit }}</span>
					</template></el-input-number
				>
				<div class="subscript">
					{{ __('Future quantity') }}: {{ component.quantityLeft - component.quantityUsed }}
					{{ component.quantityUnit }}
				</div>
			</div>
		</div>
		<el-button class="button-row" type="danger" @click="() => removeComponent(index)">
			<rh-icon color="white" name="remove" />
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
