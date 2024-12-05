<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import { ElPagination } from 'element-plus';
import { defaultPaginationValues } from './constants';

const props = defineProps({
	pagination: {
		type: Object,
		required: true,
		default: () => defaultPaginationValues
	},
	layout: {
		type: String,
		default: 'prev, pager, next'
	}
});

const needPagination = computed(() => props.pagination.totalElements > props.pagination.size);

const emit = defineEmits(['change-page']);
const handlePageChange = newPage => {
	emit('change-page', newPage);
};
</script>

<template>
	<div class="pagination-container">
		<el-pagination
			v-if="needPagination"
			:current-page="Number(props.pagination.page)"
			:page-size="Number(props.pagination.size)"
			:total="Number(props.pagination.totalElements)"
			:layout="props.layout"
			background
			@update:current-page="handlePageChange"
		/>
	</div>
</template>

<style scoped>
.pagination-container {
	margin-top: 20px;
}
</style>
