<script setup>
import { ElDatePicker, ElInput } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
import FilterItem from '../lib/components/rh-filters/filter-item.vue';
import { defineModel } from 'vue';

const filters = defineModel('filters', { type: Object });
</script>

<template>
	<filter-item>
		<el-input v-model="filters.role" clearable placeholder="Enter role">
			<template #prefix>
				<rh-icon name="search" />
			</template>
		</el-input>
	</filter-item>
	<filter-item>
		<el-date-picker
			v-model="filters.lastLogin"
			type="daterange"
			range-separator="-"
			start-placeholder="Logged in from"
			end-placeholder="to"
			format="YYYY/MM/DD"
			value-format="YYYY-MM-DD"
		/>
	</filter-item>
</template>
