<script setup>
import BaseButton from './base-button.vue';
import RhIcon from '../../lib/components/rh-icon.vue';
import { inject } from 'vue';
import { $api } from '../../lib/api/index.js';
import { $router } from '../../lib/router/router';
import { $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg';

const { logout } = inject('auth');

async function onClickLogout() {
	try {
		await $api.auth.logout();
		$router.push({ name: 'login' });
		logout();
	} catch (error) {
		$notifyUserAboutError(error);
	}
}
</script>

<template>
	<base-button class="logout" @click="onClickLogout">
		<rh-icon name="download" />
	</base-button>
</template>

<style scoped>
.logout {
	transform: rotate(-90deg);
}
</style>
