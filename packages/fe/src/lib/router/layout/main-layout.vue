<script setup>
import SidebarMenu from '../../../sidebar/sidebar-menu.vue';
import TopBar from '../../../top-bar/top-bar.vue';
import { computed, onMounted, provide, ref } from 'vue';
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
	<div class="page-with-sidebar">
		<top-bar />
		<sidebar-menu />

		<div class="wrapper">
			<div class="content-wrapper">
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>

<style scoped>
.wrapper {
	padding-top: 48px;
}

.content-wrapper {
	margin: 0 auto;
	margin-top: 16px;
	width: 100%;
	max-width: 1296px;
}

.page-with-sidebar {
	padding-left: 18rem;
}
</style>
