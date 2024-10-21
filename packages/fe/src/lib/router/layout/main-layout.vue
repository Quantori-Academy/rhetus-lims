<script setup>
import { computed, onMounted, provide, ref } from 'vue';
import PageWithSidebar from '../../../sidebar/page-with-sidebar.vue';

import { $api } from '../../api/index.js';
import { $router } from '../router.js';

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
</script>

<template>
	<page-with-sidebar>
		<router-view />
	</page-with-sidebar>
</template>
