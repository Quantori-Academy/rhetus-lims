<script setup>
import { ElInput, ElSelect, ElOption } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
import FilterItem from '../lib/components/rh-filters/filter-item.vue';
import { reactive, watch } from 'vue';

const props = defineProps({
	filters: {
		type: Object,
		required: true
	},
	storages: {
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
			<el-select v-model="filters.room" placeholder="Select room">
				<el-option
					v-for="storage of storages"
					:key="storage.id"
					:label="storage.room"
					:value="storage.room"
				/>
			</el-select>
		</filter-item>

		<filter-item>
			<el-input v-model="filters.name" clearable class="filter" placeholder="Enter name">
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

::v-deep .el-input,
.el-select {
	width: 300px;
}
</style>
