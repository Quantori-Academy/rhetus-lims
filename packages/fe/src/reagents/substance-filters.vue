<script setup>
import { ElInput, ElInputNumber } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
import FilterItem from '../lib/components/rh-filters/filter-item.vue';
import { defineModel } from 'vue';

const filters = defineModel('filters', { type: Object });
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
			<el-input-number v-model="filters.quantity" placeholder="Enter amount" :min="1" />
		</filter-item>
	</div>
</template>

<style scoped></style>
