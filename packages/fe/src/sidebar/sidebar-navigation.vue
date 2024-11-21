<script setup>
import { computed, inject } from 'vue';
import { navigationLink } from './constants.js';
import { routes } from '../lib/router/routes.js';
import SidebarNavigationItem from './sidebar-navigation-item.vue';

const { user } = inject('user');

function hasPermissions(link) {
	const route = routes.find(route => route.path === link.path);
	if (!route || !route.meta.roles) {
		return true;
	}
	return route.meta.roles.includes(user.value?.role?.name);
}

const filteredNavigationLinks = computed(() => {
	return navigationLink.filter(link => hasPermissions(link));
});
</script>

<template>
	<div class="navigation">
		<div class="project-name">Rhetus</div>
		<ul class="navigation-list">
			<sidebar-navigation-item
				v-for="link of filteredNavigationLinks"
				:key="link.name"
				:is-active="$route.path === link.path"
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
