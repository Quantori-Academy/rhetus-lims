<script setup>
import { computed, onMounted, provide, ref } from 'vue';
import MainLayout from './lib/router/layout/main-layout.vue';
import { $router } from './lib/router/router.js';
import { $api } from './lib/api/index.js';
import { roles } from './lib/constants/roles.js';

const user = ref(null);
const isInitLoading = ref(true);
const isAuthorized = computed(() => !!user.value);

async function setUser() {
	isInitLoading.value = true;
	try {
		user.value = await $api.users.fetchCurrentUserInfo();
	} catch {
		$router.push({ name: 'login' });
	} finally {
		isInitLoading.value = false;
	}
}

provide('user', {
	user,
	isAdmin: computed(() => user.value?.role?.name === roles.ADMIN),
	isResearcher: computed(() => user.value?.role?.name === roles.RESEARCHER),
	isOfficer: computed(() => user.value?.role?.name === roles.PROCUREMENT_OFFICER)
});

provide('auth', {
	isInitLoading: computed(() => isInitLoading.value),
	isAuthorized,
	logout: () => {
		user.value = null;
	},
	login: userData => {
		user.value = userData;
	}
});

onMounted(() => {
	setUser();
});
</script>

<template>
	<component :is="$route.meta.layout || MainLayout" />
</template>
