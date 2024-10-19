<script setup>
import SidebarMenu from '../../../sidebar/sidebar-menu.vue';
import TopBar from '../../../top-bar/top-bar.vue';
import { computed, onMounted, provide, ref } from 'vue';
import { $api } from '../../api/index.js';
import { $router } from '../router.js';

const user = ref(null);
const isAuthorized = computed(() => !!user.value);
const isSidebarOpen = ref(true);

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
	<div class="page-with-sidebar" :class="{ 'sidebar-collapsed': !isSidebarOpen }">
		<sidebar-menu />

		<div class="content-wrapper">
			<top-bar />
			<router-view></router-view>
		</div>
	</div>
</template>

<style scoped>
.page-with-sidebar {
	--sidebar-width: 256px;
	--top-bar-height: 48px;
	--bg-color: #fbfafd;
	--border-color: #05050614;
	--bg-color-active: #c0bec2;

	padding-left: var(--sidebar-width);
}

.sidebar-collapsed {
	padding-left: 0;
}

.content-wrapper {
	padding-top: var(--top-bar-height);
	padding-bottom: 100px;

	width: 100%;

	transition-property: padding;
	transition-duration: 200ms;
	transition-timing-function: ease;
}
</style>
