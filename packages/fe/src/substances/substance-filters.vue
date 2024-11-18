<script setup>
import { ElInput, ElInputNumber, ElSwitch } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
import FilterItem from '../lib/components/rh-filters/filter-item.vue';
import KetcherEditor from '../ketcher-editor/ketcher-editor.vue';
import { defineModel } from 'vue';

const filters = defineModel('filters', { type: Object });
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
		<el-switch v-model="filters.expired" active-text="Expired" inactive-text="All" />
	</filter-item>

	<filter-item>
		<ketcher-editor v-model:smiles="filters.smiles" />
	</filter-item>
</template>

<style scoped></style>
