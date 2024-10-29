<script setup>
import { ref } from 'vue';
import { ElButton } from 'element-plus';
import RhIcon from '../rh-icon.vue';
const visible = ref(true);

const toggleFilterView = () => {
	visible.value = !visible.value;
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
	<div class="filters-container">
		<slot v-if="visible" name="filters" />
	</div>
</template>

<style>
.action-buttons {
	display: flex;
	justify-content: end;
	align-items: center;
}

.filters-container {
	display: flex;
	flex-wrap: wrap;
	justify-content: start;
	margin: 20px 0 15px 0;
}
</style>
