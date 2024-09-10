<script setup>
import { ElTable, ElTableColumn } from 'element-plus';
import { onMounted, ref } from 'vue';
import { $api } from '../lib/api';

const data = ref([]);

onMounted(async () => {
	const response = await $api.cities.fetchCity(1);
	data.value = [response.city];
});
</script>

<template>
	<div class="wrapper">
		<el-table :data="data" stripe>
			<el-table-column prop="name" label="Name" />
			<el-table-column prop="id" label="Id" />
			<el-table-column prop="popularity" label="Popularity" width="100" />
		</el-table>
	</div>
</template>

<style scoped>
.wrapper {
	display: grid;
	place-content: center;
	gap: 24px;
}
</style>
