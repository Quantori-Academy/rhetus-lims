<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus';

const route = useRoute();
const breadcrumbs = computed(() => {
	const breadcrumbMeta = route.meta.breadcrumb;
	return typeof breadcrumbMeta === 'function' ? breadcrumbMeta(route) : breadcrumbMeta || [];
});
</script>

<template>
	<slot name="before" />
	<el-breadcrumb>
		<el-breadcrumb-item
			v-for="(crumb, index) of breadcrumbs"
			:key="index"
			:to="crumb.path ? { path: crumb.path } : null"
		>
			<router-link v-if="crumb.path" :to="crumb.path">{{ crumb.name }}</router-link>
			<span v-else>{{ crumb.name }}</span>
		</el-breadcrumb-item>
	</el-breadcrumb>
</template>
