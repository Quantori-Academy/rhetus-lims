<script setup>
import { onMounted, ref } from 'vue';
import RhIcon from '~/lib/components/rh-icon.vue';
import { $api } from '../lib/api';

const data = ref([]);

onMounted(async () => {
	const response = await $api.rickandmorty.fetchCharacter('alive', 'Male', 'Human');
	data.value = response.slice(0, 9);
});
</script>

<template>
	<div class="wrapper">
		<img width="30" height="30" src="../lib/assets/images/logo.svg" alt="" />
		<div class="mb-4">
			<el-button type="primary">Primary</el-button>
			<el-button>Default</el-button>
		</div>

		<rh-icon name="dollar"></rh-icon>

		<el-table :data="data" stripe>
			<el-table-column prop="name" label="Name" width="80" />
			<el-table-column prop="species" label="Species" />
			<el-table-column prop="status" label="Status" />
			<el-table-column prop="gender" label="Gender" />
		</el-table>
	</div>
</template>

<style scoped>
.wrapper {
	display: grid;
	gap: 24px;
	place-content: center;
}
</style>
