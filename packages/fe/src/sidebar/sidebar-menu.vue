<script setup>
import { inject, computed } from 'vue';
import RhIcon from '../lib/components/rh-icon.vue';
import { $route } from '../lib/router/router.js';
import { navigationLink } from './constants.js';
import { routes } from '../lib/router/routes.js';
import SidebarHeader from './sidebar-header.vue';

const { user } = inject('user');

const emit = defineEmits(['toggle-collapse']);

function handleCollapse() {
	emit('toggle-collapse');
}

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
	<nav class="sidebar">
		<sidebar-header @toggle-collapse="handleCollapse" />
		<div class="navigation">
			<div class="project-name">Rhetus</div>
			<ul class="navigation-list">
				<li
					v-for="link of filteredNavigationLinks"
					:key="link.name"
					:class="{ 'active-route': $route.path === link.path }"
				>
					<router-link :to="link.path">
						<div class="active-route-marker"></div>
						<rh-icon :name="link.icon" />
						<span class="route-name">{{ link.name }}</span>
					</router-link>
				</li>
			</ul>
		</div>
	</nav>
</template>

<style scoped>
.sidebar {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;

	z-index: 10;

	display: flex;
	flex-direction: column;

	width: var(--sidebar-width);

	border-right: 1px solid var(--border-color);
	background-color: var(--bg-color);

	color: var(--color-text-regular);
	transform: translate3d(0, 0, 0);

	transition-property: transform;
	transition-duration: 200ms;
	transition-timing-function: ease;

	:focus,
	:focus-visible {
		box-shadow:
			0 0 0 1px var(--rh-color-page-white),
			0 0 0 3px var(--rh-color-primary-600);
		outline: none;
	}
}

.navigation {
	.project-name {
		padding: 8px 12px;
		font-weight: 600;
	}

	.navigation-list {
		padding: 4px;

		.active-route {
			.active-route-marker {
				opacity: 100;
			}

			a {
				background-color: var(--rh-color-neutral-300);
			}
		}

		li {
			list-style: none;

			a {
				position: relative;
				display: flex;
				justify-content: start;
				align-items: center;
				gap: 8px;
				margin-bottom: 2px;
				padding: 4px 8px;

				border-radius: 4px;

				color: inherit;
				text-decoration: none;

				&:focus {
					background-color: var(--rh-color-neutral-300);
				}

				&:hover {
					background-color: var(--rh-color-neutral-300);
				}

				&:active {
					background-color: var(--rh-color-neutral-400);
				}
			}

			.active-route-marker {
				opacity: 0;
				position: absolute;
				top: 4px;
				bottom: 4px;
				left: 4px;
				margin-right: 4px;
				width: 3px;
				border-radius: 3px;
				background-color: var(--rh-color-primary-400);
			}

			.route-name {
				flex-grow: 1;
				line-height: 1.5;
				font-weight: 600;
			}
		}
	}
}
</style>
