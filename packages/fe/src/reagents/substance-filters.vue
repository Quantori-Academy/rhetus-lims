<script setup>
import { ElInput, ElInputNumber } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
import FilterItem from '../lib/components/rh-filters/filter-item.vue';
import { ref, watch } from 'vue';

const filters = ref({
	name: '',
	category: '',
	quantity: null
});
const emit = defineEmits(['update:filters']);
watch(
	filters,
	newFilters => {
		emit('update:filters', newFilters);
	},
	{ deep: true }
);
</script>

<template>
	<div class="filters-container">
		<filter-item>
			<el-input v-model="filters.name" clearable placeholder="Enter name">
				<template #prefix>
					<rh-icon name="search" />
				</template>
			</el-input>
		</filter-item>

		<filter-item>
			<el-input v-model="filters.category" clearable placeholder="Enter category">
				<template #prefix>
					<rh-icon name="search" />
				</template>
			</el-input>
		</filter-item>

		<filter-item>
			<el-input-number v-model="filters.quantity" placeholder="Enter amount" :min="1" />
		</filter-item>
	</div>
</template>

<style scoped>
::v-deep .el-input-number {
	width: 300px;
}
</style>
