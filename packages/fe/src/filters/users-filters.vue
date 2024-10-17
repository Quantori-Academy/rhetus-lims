<script setup>
import { ElDatePicker, ElInput } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
import FilterItem from './filter-item.vue';
</script>

<template>
	<filter-item>
		<el-input class="filter" placeholder="String filter">
			<template #prefix>
				<rh-icon name="search" />
			</template>
		</el-input>
	</filter-item>

	<filter-item>
		<el-date-picker class="filter" type="date" placeholder="Date filter" />
	</filter-item>
</template>
