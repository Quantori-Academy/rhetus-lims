<script setup>
import { ElInput } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
import FilterItem from '../lib/components/rh-filters/filter-item.vue';
</script>

<template>
	<div class="filters-container">
		<filter-item>
			<el-input class="filter" placeholder="String filter">
				<template #prefix>
					<rh-icon name="search" />
				</template>
			</el-input>
		</filter-item>

		<filter-item>
			<el-input class="filter" placeholder="String filter">
				<template #prefix>
					<rh-icon name="search" />
				</template>
			</el-input>
		</filter-item>
	</div>
</template>

<style scoped>
.filters-container {
	display: flex;
	flex-wrap: wrap;
	justify-content: start;
	margin: 20px 0 15px 0;
}
</style>
