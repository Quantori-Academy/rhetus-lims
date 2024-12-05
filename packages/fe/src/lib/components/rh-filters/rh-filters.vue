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
	<div class="btn-container action">
		<el-button @click="toggleFilterView">
			<rh-icon color="#1785be" name="preferences" class="icon" />
			{{ visible ? 'Hide filters' : 'Show filters' }}
		</el-button>
		<slot name="action-buttons" />
	</div>
	<div class="filters-container">
		<slot v-if="visible" name="filters" />
	</div>
</template>

<style scoped>
.btn-container > * {
	margin-bottom: 5px;
}

.filters-container {
	display: flex;
	flex-wrap: wrap;
	justify-content: start;
	margin: 20px 0 15px 0;
}
</style>
