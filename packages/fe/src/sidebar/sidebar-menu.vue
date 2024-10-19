<script setup>
import { inject } from 'vue';
import RhIcon from '../lib/components/rh-icon.vue';
import { $route } from '../lib/router/router.js';
import { navigationLink } from './constants.js';
import SidebarButton from './sidebar-button.vue';

const { user } = inject('user');
</script>

<template>
	<nav class="sidebar">
		<div class="user-bar-container">
			<div class="user-bar">
				<router-link to="/" class="logo link">
					<img src="../lib/assets/images/logo.svg" width="24" height="24" alt="Rhetus logo" />
				</router-link>

				<div class="toggle-and-profile">
					<sidebar-button />

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
						{{ link.name }}
					</router-link>
				</li>
			</ul>
		</div>
	</nav>
</template>

<style>
.sidebar {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;

	display: flex;
	flex-direction: column;

	width: var(--sidebar-width);

	border-right: 1px solid var(--border-color);
	background-color: var(--bg-color);
}

.user-bar-container {
	padding: 8px;
	min-height: var(--top-bar-height);
	border-bottom: 1px solid #eeecf0;

	background-color: #eeecf0;

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
			background-color: #d6d5d9;
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
		padding: 12px 16px;
		font-weight: 700;
	}

	.navigation-list {
		padding: 0;
		list-style: none;

		.active-route-marker {
			width: 3px;
			height: 20px;
			border-radius: 6px;
			background-color: transparent;
		}

		li {
			a {
				display: flex;
				align-items: center;
				gap: 8px;
				margin: 4px;
				padding: 4px 8px;
				border-radius: 6px;
				color: inherit;
				text-decoration: none;
				font-size: 16px;

				&:hover {
					background-color: #e1e0e4;
				}
			}
		}

		.active-route {
			.active-route-marker {
				background-color: #0eabe2;
			}

			a {
				background-color: #e1e0e4;
			}
		}
	}
}
</style>
