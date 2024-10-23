<script setup>
import { computed, onMounted, provide, ref } from 'vue';
import PageWithSidebar from '../../../sidebar/page-with-sidebar.vue';

import { $api } from '../../api/index.js';
import { $router } from '../router.js';
import { $notify } from '../../utils/feedback/notify-msg.js';

const user = ref(null);
const isAuthorized = computed(() => !!user.value);

async function setUser() {
	try {
		user.value = await $api.users.fetchCurrentUserInfo();
	} catch {
		$router.push({ name: 'login' });
	}
}

provide('user', {
	user,
	isAdmin: user.value?.role?.name === 'administrator',
	isResearcher: user.value?.role?.name === 'researcher'
});

provide('auth', {
	isAuthorized: isAuthorized.value
});

onMounted(() => {
	setUser();
});

$router.beforeEach((to, from, next) => {
	if (!to.matched.length) {
		return $router.push({ name: '404'});
	}

	const routeRoles = to.meta.roles || [];
	const userRole = user.value?.role?.name;

	if (routeRoles.length === 0) {
		return next();
	}

	if (routeRoles.includes(userRole)) {
		return next();
	} else {
		$notify({
			title: 'Error',
			message:
				'You do not have the credentials to access this page. Please consult your administator',
			type: 'error'
		});
		$router.push({ name: '404'});
	}
});
</script>

<template>
	<page-with-sidebar>
		<router-view />
	</page-with-sidebar>
</template>
