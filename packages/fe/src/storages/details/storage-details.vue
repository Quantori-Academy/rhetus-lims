<script setup>
import StorageForm from '../storage-form.vue';
import SubstancesTable from '../substances-table.vue';

const props = defineProps({
	id: {
		type: String,
		default: null
	}
});
</script>

<template>
	<div class="storage-content-table">
		<storage-form :id="props.id" />
		<substances-table :id="props.id" />
	</div>
</template>

<style scoped>
.storage-content-table {
	margin-top: 20px;
}
</style>
