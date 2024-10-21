<script setup>
import { onMounted, ref } from 'vue';
import { ElTable, ElTableColumn } from 'element-plus';
import { $api } from '../../lib/api/index';
import { $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg';
import { $router } from '../../lib/router/router.js';

const props = defineProps({
	id: {
		type: String,
		default: null
	}
});

const substances = ref(null);
const isLoading = ref(false);

async function setSubstances(id) {
	isLoading.value = true;
	try {
		const data = await $api.substances.fetchSubstances(id);
		substances.value = data.substances;
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error viewing substances content');
	} finally {
		isLoading.value = false;
	}
}

function viewSubstance(row) {
	$router.push({ name: 'reagent-details', params: { id: row.id } });
}

onMounted(() => {
	setSubstances(props.id);
});
</script>

<template>
	<div>
		<el-table v-loading="isLoading" :data="substances" @row-click="viewSubstance">
			<el-table-column prop="name" label="Name" />
			<el-table-column prop="category" label="Category" />
			<el-table-column prop="structure" label="Structure" />
			<el-table-column prop="description" label="Description" />
			<el-table-column prop="quantityLeft" label="Quantity Left" />
		</el-table>
	</div>
</template>

<style scoped>
:deep(.el-table__row):hover {
	cursor: pointer;
}
</style>
