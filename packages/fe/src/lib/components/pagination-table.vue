<script setup>
import { ref, watch } from 'vue';
import { ElPagination } from 'element-plus';

const props = defineProps({
	page: {
		type: Number,
		default: 1,
		required: true
	},
	limit: {
		type: Number,
		default: 3,
		required: true
	},
	totalItems: {
		type: Number,
		required: true
	},
	pageSizes: {
		type: Array,
		default: () => [10, 20, 30, 40]
	},
	size: {
		type: String,
		default: 'default'
	},
	background: {
		type: Boolean,
		default: false
	},
	disabled: {
		type: Boolean,
		default: false
	},
	layout: {
		type: String,
		default: 'total, sizes, prev, pager, next, jumper'
	}
});

const emit = defineEmits(['update:page', 'update:limit']);

const currentPage = ref(props.page);
const currentLimit = ref(props.limit);

watch(
	() => props.page,
	newPage => {
		currentPage.value = newPage;
	}
);

watch(
	() => props.limit,
	newLimit => {
		currentLimit.value = newLimit;
	}
);

const handleSizeChange = val => {
	emit('update:limit', val);
};

const handleCurrentChange = val => {
	emit('update:page', val);
};
</script>

<template>
	<div class="pagination-container">
		<el-pagination
			v-model:current-page="currentPage"
			v-model:page-size="currentLimit"
			:page-sizes="pageSizes"
			:size="size"
			:disabled="disabled"
			:background="background"
			:layout="layout"
			:total="totalItems"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		/>
	</div>
</template>

<style scoped>
.pagination-container {
	margin-top: 20px;
}
</style>
