<script setup>
import UserProfile from './profile-details.vue';
import ManagePassword from './manage-password.vue';

const props = defineProps({ id: { type: String, default: null } });
</script>

<template>
	<div class="wrapper">
		<UserProfile :id="props.id" />
	</div>
	<div class="wrapper">
		<ManagePassword id="props.id" />
	</div>
</template>

<style scoped>
.section-header {
	margin-bottom: 12px;
	font-weight: 500;
	font-size: large;
}
</style>
