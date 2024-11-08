<script setup>
import { ElInput, ElDatePicker } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
import FilterItem from '../lib/components/rh-filters/filter-item.vue';
import { defineModel } from 'vue';

const filters = defineModel('filters', { type: Object });
</script>

<template>
	<div>
		<filter-item>
			<el-input v-model="filters.title" clearable placeholder="Enter title">
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
	</div>
	<div>
		<filter-item>
			<el-date-picker
				v-model="filters.createdAt"
				type="date"
				placeholder="Creation date"
				format="YYYY/MM/DD"
				value-format="YYYY-MM-DD"
			/>
		</filter-item>
		<filter-item>
			<el-date-picker
				v-model="filters.updatedAt"
				type="date"
				placeholder="Update date"
				format="YYYY/MM/DD"
				value-format="YYYY-MM-DD"
			/>
		</filter-item>
	</div>
</template>
