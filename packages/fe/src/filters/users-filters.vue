<script setup>
import { ElDatePicker, ElInput } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
import FilterItem from './filter-item.vue';
import { reactive, watch } from 'vue';

const props = defineProps({
	filters: {
		type: Object,
		required: true
	}
});

const emit = defineEmits(['update:filters']);
const filters = reactive({ ...props.filters });

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
			<el-input v-model="filters.role" clearable class="filter" placeholder="String filter">
				<template #prefix>
					<rh-icon name="search" />
				</template>
			</el-input>
		</filter-item>

		<filter-item>
			<el-date-picker
				v-model="filters.date"
				class="filter"
				type="date"
				placeholder="Date filter"
				format="YYYY/MM/DD"
				value-format="YYYY-MM-DD"
			/>
		</filter-item>
	</div>
</template>

<style scoped>
.filters-container {
	display: flex;
	flex-wrap: wrap;
	justify-content: start;
	margin: 20px 0 15px 0;
}

::v-deep .el-input {
	width: 300px;
}
</style>
