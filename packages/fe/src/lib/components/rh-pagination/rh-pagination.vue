<script setup>
import { ref, watch, defineProps, defineEmits, computed } from 'vue';
import { ElPagination } from 'element-plus';
import { defaultPaginationValues } from './constants';

const props = defineProps({
	pagination: {
		type: Object,
		required: true
	},
	pagerCount: {
		type: Number,
		default: 5
	},
	layout: {
		type: String,
		default: 'prev, pager, next'
	}
});

const page = ref(defaultPaginationValues.page);
const needPagination = computed(() => props.pagination.totalElements > props.pagination.size);

watch(
	() => props.pagination,
	newPagination => {
		page.value = newPagination.page;
	},
	{ deep: true }
);

const emit = defineEmits(['change-page']);
const handlePageChange = newPage => {
	emit('change-page', newPage);
};
</script>

<template>
	<div class="pagination-container">
		<el-pagination
			v-if="needPagination"
			:current-page="page + 1"
			:page-size="pagination.size"
			:total="pagination.totalElements"
			:layout="layout"
			@update:current-page="handlePageChange"
		/>
	</div>
</template>
