<script setup>
import FilterItem from '../lib/components/rh-filters/filter-item.vue';
import { ElInput, ElDatePicker } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';

const filters = defineModel('filters', { type: Object });
</script>

<template>
	<filter-item>
		<el-input v-model="filters.status" clearable placeholder="Enter status">
			<template #prefix>
				<rh-icon name="search" />
			</template>
		</el-input>
	</filter-item>
	<filter-item>
		<el-input v-model="filters.reagentName" clearable placeholder="Enter reagent name">
			<template #prefix>
				<rh-icon name="search" />
			</template>
		</el-input>
	</filter-item>
	<filter-item>
		<el-date-picker
			v-model="filters.creationRange"
			type="daterange"
			start-placeholder="Creation start date"
			end-placeholder="End date"
		/>
	</filter-item>
	<filter-item>
		<el-date-picker
			v-model="filters.updateRange"
			type="daterange"
			start-placeholder="Update start date"
			end-placeholder="End date"
		/>
	</filter-item>
</template>
