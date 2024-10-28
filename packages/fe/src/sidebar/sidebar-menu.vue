<script setup>
import { inject } from 'vue';
import RhIcon from '../lib/components/rh-icon.vue';
import { $route } from '../lib/router/router.js';
import { navigationLink } from './constants.js';
import SidebarButton from './sidebar-button.vue';

const { user } = inject('user');

const emit = defineEmits(['toggle-collapse']);

function handleCollapse() {
	emit('toggle-collapse');
}
</script>

<template>
	<nav class="sidebar">
		<div class="user-bar-container">
			<div class="user-bar">
				<router-link to="/" class="logo link">
					<img src="../lib/assets/images/logo.svg" width="24" height="24" alt="Rhetus logo" />
				</router-link>

				<div class="toggle-and-profile">
					<sidebar-button @click="handleCollapse" />

					<router-link v-if="user" to="/profile" class="link">
						<div class="profile">
							{{ user.username.slice(0, 2) }}
						</div>
					</router-link>
				</div>
			</div>
		</div>
		<div class="navigation">
			<div class="project-name">Rhetus</div>
			<ul class="navigation-list">
				<li
					v-for="link of navigationLink"
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

	color: var(--text-color);
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

.user-bar-container {
	padding: 8px;
	min-height: var(--top-bar-height);
	border-bottom: 1px solid var(--rh-color-neutral-250);

	background-color: var(--rh-color-neutral-250);

	.user-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.toggle-and-profile {
			display: flex;
			align-items: center;
			gap: 6px;
		}
	}

	.link {
		padding: 4px;
		border: none;
		border-radius: 4px;
		background: transparent;
		color: inherit;
		text-decoration: none;

		&:hover {
			background-color: var(--rh-color-neutral-350);
		}

		&:active {
			background-color: var(--bg-color-active);
		}
	}

	.logo {
		max-height: 32px;
	}

	.profile {
		display: flex;
		justify-content: center;
		align-items: center;

		width: 24px;
		height: 24px;

		border: 1px solid var(--border-color);
		border-radius: 50%;
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
