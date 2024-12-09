<script setup>
import { ElInput, ElSwitch } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
import FilterItem from '../lib/components/rh-filters/filter-item.vue';
import KetcherEditor from '../ketcher-editor/ketcher-editor.vue';
import { defineModel } from 'vue';
import { __ } from '../lib/locales';

const filters = defineModel('filters', { type: Object });
</script>

<template>
	<filter-item>
		<el-input v-model="filters.name" clearable :placeholder="__('Enter name')">
			<template #prefix>
				<rh-icon name="search" />
			</template>
		</el-input>
	</filter-item>

	<filter-item>
		<ketcher-editor v-model:smiles="filters.smiles" />
	</filter-item>

	<div class="switch-filters">
		<filter-item>
			<el-switch
				v-model="filters.expired"
				:active-text="__('Expired')"
				:inactive-text="__('All')"
			/>
		</filter-item>

		<filter-item>
			<el-switch
				v-model="filters.deleted"
				:active-text="__('Deleted')"
				:inactive-text="__('Existing')"
			/>
		</filter-item>
	</div>
</template>

<style scoped>
.switch-filters {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}
</style>
