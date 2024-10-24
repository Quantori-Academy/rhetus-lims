<script setup>
import { ElDatePicker, ElInput } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
import FilterItem from '../lib/components/rh-filters/filter-item.vue';
import { ref, watch } from 'vue';

const filters = ref({
	role: '',
	date: null
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
			<el-input v-model="filters.role" clearable placeholder="Enter role">
				<template #prefix>
					<rh-icon name="search" />
				</template>
			</el-input>
		</filter-item>

		<filter-item>
			<el-date-picker
				v-model="filters.date"
				type="date"
				placeholder="Date filter"
				format="YYYY/MM/DD"
				value-format="YYYY-MM-DD"
			/>
		</filter-item>
	</div>
</template>

<style scoped>
::v-deep .el-date-editor {
	width: 300px;
}
</style>
