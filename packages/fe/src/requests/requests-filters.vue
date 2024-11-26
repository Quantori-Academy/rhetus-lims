<script setup>
import FilterItem from '../lib/components/rh-filters/filter-item.vue';
import { ElInput, ElDatePicker, ElSelect, ElOption } from 'element-plus';
import { Statuses } from './constants.js';

const filters = defineModel('filters', { type: Object });
const statuses = Object.values(Statuses);
</script>

<template>
	<filter-item>
		<el-select v-model="filters.status" filterable placeholder="Enter status" clearable>
			<el-option v-for="status of statuses" :key="status" :label="status" :value="status" />
		</el-select>
	</filter-item>
	<filter-item>
		<el-input v-model="filters.reagentName" clearable placeholder="Reagent name" />
	</filter-item>
	<filter-item>
		<el-date-picker
			v-model="filters.creationRange"
			type="daterange"
			start-placeholder="Creation start date"
			end-placeholder="End date"
			format="YYYY/MM/DD"
			value-format="YYYY-MM-DD"
		/>
	</filter-item>
	<filter-item>
		<el-date-picker
			v-model="filters.updateRange"
			type="daterange"
			start-placeholder="Update start date"
			end-placeholder="End date"
			format="YYYY/MM/DD"
			value-format="YYYY-MM-DD"
		/>
	</filter-item>
</template>
