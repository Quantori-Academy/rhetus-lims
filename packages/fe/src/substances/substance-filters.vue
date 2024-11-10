<script setup>
import { ElInput, ElInputNumber, ElSelect, ElOption } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
import FilterItem from '../lib/components/rh-filters/filter-item.vue';
import { defineModel } from 'vue';

const filters = defineModel('filters', { type: Object });

const expirationOptions = [
	{ label: 'All', value: [] },
	{ label: 'Expired', value: [new Date('0001-01-01T00:00:00.000Z'), new Date()] }
];
</script>

<template>
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

	<filter-item>
		<el-select v-model="filters.expirationDate" placeholder="Select by" value-key="label">
			<el-option
				v-for="option of expirationOptions"
				:key="option.label"
				:label="option.label"
				:value="option"
			/>
		</el-select>
	</filter-item>
</template>

<style scoped></style>
