<script setup>
import { ElInput } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
import FilterItem from '../lib/components/rh-filters/filter-item.vue';
import { ref, watch } from 'vue';

const filters = ref({
	room: '',
	name: ''
});
const emit = defineEmits(['update:filters']);
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
			<el-input v-model="filters.room" clearable placeholder="Enter room">
				<template #prefix>
					<rh-icon name="search" />
				</template>
			</el-input>
		</filter-item>

		<filter-item>
			<el-input v-model="filters.name" clearable placeholder="Enter name">
				<template #prefix>
					<rh-icon name="search" />
				</template>
			</el-input>
		</filter-item>
	</div>
</template>
