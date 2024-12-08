<script setup>
import { computed, inject } from 'vue';
import { navigationLink } from './constants.js';
import { routes } from '../lib/router/routes.js';
import SidebarNavigationItem from './sidebar-navigation-item.vue';
import { $router } from '../lib/router/router.js';

const { user } = inject('user');

function hasPermissions(link) {
	if (!user.value?.role?.name) return false;

	const route = routes.find(route => route.path === link.path);
	if (!route || !route.meta.roles) {
		return true;
	}

	return route.meta.roles.includes(user.value.role.name);
}

const filteredNavigationLinks = computed(() => {
	return navigationLink.filter(hasPermissions);
});
const isActive = link => {
	if (link?.path && $router.currentRoute.value?.path) {
		const cleanRoutePath =
			$router.currentRoute.value.path.split('/')[0] +
			'/' +
			$router.currentRoute.value.path.split('/')[1];
		const cleanLinkPath = link.path.split('/')[0] + '/' + link.path.split('/')[1];
		return cleanRoutePath.startsWith(cleanLinkPath);
	}
	return false;
};
</script>

<template>
	<div class="navigation">
		<div class="project-name">Rhetus</div>
		<ul class="navigation-list">
			<sidebar-navigation-item
				v-for="link of filteredNavigationLinks"
				:key="link.name"
				:is-active="isActive(link)"
				:link="link"
			/>
		</ul>
	</div>
</template>

<style scoped>
.navigation {
	.project-name {
		padding: 8px 12px;
		font-weight: 700;
	}

	.navigation-list {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 4px;
	}

	:focus,
	:focus-visible {
		box-shadow:
			0 0 0 1px var(--rh-color-page-white),
			0 0 0 3px var(--rh-color-primary-600);
		outline: none;
	}
}
</style>
