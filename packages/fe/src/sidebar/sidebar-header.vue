<script setup>
import ProfileLink from './sidebar-buttons/profile-link.vue';
import LogoutButton from './sidebar-buttons/logout-button.vue';
import RhIcon from '../lib/components/rh-icon.vue';
import BaseButton from './sidebar-buttons/base-button.vue';

const emit = defineEmits(['toggle-collapse']);

function handleCollapse() {
	emit('toggle-collapse');
}
</script>

<template>
	<div class="user-bar-container">
		<div class="user-bar">
			<router-link to="/" class="logo link">
				<img
					src="../lib/assets/images/logo-in-square.png"
					width="24"
					height="24"
					alt="Rhetus logo"
				/>
			</router-link>

			<div class="button-group">
				<base-button @click="handleCollapse">
					<rh-icon name="sidebar" />
				</base-button>
				<profile-link />
				<logout-button />
			</div>
		</div>
	</div>
</template>

<style scoped>
.user-bar-container {
	padding: 8px;
	min-height: var(--top-bar-height);
	border-bottom: 1px solid var(--rh-color-neutral-250);

	background-color: var(--rh-color-neutral-250);

	.user-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.link {
		padding: 4px;
		border: none;
		border-radius: 4px;
		background: transparent;
		color: inherit;
		text-decoration: none;
		transition:
			box-shadow 0.2s ease-in-out,
			background-color 0.2s ease-in-out;
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

	.button-group {
		display: flex;
		align-items: center;
		gap: 6px;
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
