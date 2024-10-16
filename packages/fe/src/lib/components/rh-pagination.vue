<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import { ElPagination } from 'element-plus';

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

const defaultPaginationValues = {
	page: 1,
	size: 2,
	totalElements: 0
};

const currentPage = ref(defaultPaginationValues.page);

watch(
	() => props.pagination,
	newPagination => {
		currentPage.value = newPagination.page;
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
			:current-page="currentPage"
			:page-size="pagination.size"
			:total="pagination.totalElements"
			:layout="layout"
			@update:current-page="handlePageChange"
		/>
	</div>
</template>
