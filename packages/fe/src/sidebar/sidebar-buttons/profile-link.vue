<script setup>
import { inject } from 'vue';

const { user } = inject('user');
</script>

<template>
	<router-link v-if="user" to="/profile" class="profile-button link">
		{{ user.username.slice(0, 2) }}
	</router-link>
</template>

<style scoped>
.profile-button {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 32px;
	height: 32px;
	border: 1px solid var(--border-color);
	border-radius: 50%;
}
</style>
