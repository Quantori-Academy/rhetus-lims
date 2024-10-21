<script setup>
import { ref } from 'vue';
import { ElButton } from 'element-plus';
import RhIcon from '../rh-icon.vue';
const visible = ref(true);

const toggleFilterView = () => {
	visible.value = !visible.value;
};

const emit = defineEmits(['reset-filters', 'set-filters']);
const resetFilters = () => {
	emit('reset-filters');
};
const setFilters = () => {
	emit('set-filters');
};
</script>

<template>
	<div class="action-buttons">
		<el-button @click="toggleFilterView">
			<rh-icon color="#409eff" name="sliders-h" />
			{{ visible ? 'Hide filters' : 'Show filters' }}
		</el-button>
		<slot name="action-buttons" />
	</div>

	<slot v-if="visible" name="filters" />

	<div v-if="visible" class="after-buttons">
		<slot name="after-buttons">
			<el-button @click="setFilters">Apply filters</el-button>
			<el-button @click="resetFilters">Reset filters</el-button>
		</slot>
	</div>
</template>

<style>
.action-buttons {
	display: flex;
	justify-content: end;
	align-items: center;
}

.after-buttons {
	display: flex;
	justify-content: end;
}
</style>
