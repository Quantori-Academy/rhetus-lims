<script setup>
import { inject } from 'vue';
import { ElButton } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
import { $route } from '../lib/router/router.js';
import { navigationLink } from './constants.js';

const { user } = inject('user');
</script>

<template>
	<nav class="sidebar">
		<div class="user-bar">
			<router-link class="logo" to="/">
				<img src="../lib/assets/images/logo.svg" width="30" height="30" alt="Rhetus logo" />
			</router-link>

			<div class="toggle-and-profile">
				<el-button>
					<rh-icon name="envelope" angle="-90deg" size="22" />
				</el-button>

				<div class="profile">
					<router-link v-if="user" to="/profile">{{ user.username.slice(0, 2) }}</router-link>
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

	width: 18rem;
	background-color: #fbfafd;
}

.user-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 8px 12px;
	padding-bottom: 16px;
	background-color: #eeecf0;

	.logo {
		display: flex;
		align-items: center;
		padding: 4px 4px;
		border-radius: 6px;

		&:hover {
			background-color: #d6d5d9;
		}
	}

	.toggle-and-profile {
		display: flex;
		align-items: center;
		gap: 6px;

		button {
			width: 36px;
			height: 36px;
			border: none;
			background: transparent;

			&:hover {
				background-color: #d6d5d9;
			}
		}
	}

	.profile {
		display: flex;
		justify-content: center;
		align-items: center;

		width: 36px;
		height: 36px;
		border-radius: 6px;

		&:hover {
			background-color: #d6d5d9;
		}

		a {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 32px;
			height: 32px;
			border: 1px solid #d6d5d9;
			border-radius: 100%;
			background: #fbfafd;
			color: inherit;
			text-decoration: none;
		}
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
				background-color: blue;
			}

			a {
				background-color: #e1e0e4;
			}
		}
	}
}
</style>
