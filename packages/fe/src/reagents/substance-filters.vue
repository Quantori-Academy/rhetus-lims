<script setup>
import { ElSelect, ElInput, ElOption, ElInputNumber } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
import FilterItem from '../lib/components/rh-filters/filter-item.vue';
import { reactive, watch } from 'vue';

const props = defineProps({
	filters: {
		type: Object,
		required: true
	},
	reagents: {
		type: Array,
		required: true
	}
});

const emit = defineEmits(['update:filters']);
const filters = reactive({ ...props.filters });

watch(
	filters,
	newFilters => {
		emit('update:filters', newFilters);
	},
	{ deep: true }
);
</script>

<template>
	<div class="filters-container">
		<filter-item>
			<el-input v-model="filters.name" clearable class="filter" placeholder="Enter name">
				<template #prefix>
					<rh-icon name="search" />
				</template>
			</el-input>
		</filter-item>

		<filter-item>
			<el-select v-model="filters.category" clearable placeholder="Select category">
				<el-option
					v-for="reagent of reagents"
					:key="reagent.id"
					:label="reagent.category"
					:value="reagent.category"
				/>
			</el-select>
		</filter-item>

		<filter-item>
			<el-input-number v-model="filters.quantity" placeholder="Enter amount" :min="1" />
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

::v-deep .el-input,
.el-select,
.el-input-number {
	width: 300px;
}
</style>
