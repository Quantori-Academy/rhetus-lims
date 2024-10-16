<script setup>
import { ref } from 'vue';
import { ElButton, ElInput, ElDatePicker, ElSelect } from 'element-plus';
import RhIcon from './rh-icon.vue';

const visible = ref(true);
const toggleFilterView = () => {
	visible.value = !visible.value;
};
</script>

<template>
	<slot name="action-buttons">
		<div class="action-buttons">
			<el-button @click="toggleFilterView">
				<rh-icon color="#409eff" name="sliders-h" />
				Hide filters
			</el-button>
			<el-button type="primary">Add New User</el-button>
		</div>
	</slot>

	<slot v-if="visible" name="filters">
		<div class="filters">
			<el-input class="filter" placeholder="String filter">
				<template #prefix>
					<rh-icon name="search" />
				</template>
			</el-input>
			<el-date-picker class="filter" type="date" placeholder="Date filter" />
			<el-select class="filter" placeholder="Select filter" />
			<el-select
				class="filter"
				multiple
				collapse-tags
				collapse-tags-tooltip
				placeholder="Big select filter"
			/>
		</div>
		<div class="second-row">
			<el-button>Reset filters</el-button>
		</div>
	</slot>
</template>

<style scoped>
.action-buttons {
	display: flex;
	justify-content: end;
}
.filters {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	padding: 20px 0;

	div {
		width: 200px;
	}
}

.second-row {
	display: flex;
	justify-content: end;
}
</style>
