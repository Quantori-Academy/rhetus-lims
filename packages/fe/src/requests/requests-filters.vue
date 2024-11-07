<script setup>
import FilterItem from '../lib/components/rh-filters/filter-item.vue';
import { ElInput } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';

const filters = defineModel('filters', { type: Object });
</script>

<template>
	<filter-item>
		<el-input v-model="filters.reagentName" clearable placeholder="Enter reagent name">
			<template #prefix>
				<rh-icon name="search" />
			</template>
		</el-input>
	</filter-item>
	<filter-item>
		<el-input v-model="filters.status" clearable placeholder="Enter status">
			<template #prefix>
				<rh-icon name="search" />
			</template>
		</el-input>
	</filter-item>
</template>
