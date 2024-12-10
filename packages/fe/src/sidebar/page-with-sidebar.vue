<script setup>
import { ref } from 'vue';
import SidebarMenu from './sidebar-menu.vue';
import TopBar from './top-bar/top-bar.vue';
import { getSidebarCollapsedState, toggleSidebarCollapse } from './sidebar-collapse.js';

const isSidebarCollapsed = ref(getSidebarCollapsedState());

function handleToggle() {
	isSidebarCollapsed.value = !isSidebarCollapsed.value;
	toggleSidebarCollapse();
}
</script>

<template>
	<div class="page-with-sidebar" :class="{ 'page-with-sidebar-collapsed': isSidebarCollapsed }">
		<sidebar-menu @toggle-collapse="handleToggle" />
		<div class="sidebar-overlay"></div>
		<div class="content-wrapper">
			<top-bar :is-sidebar-collapsed="isSidebarCollapsed" @toggle-collapse="handleToggle" />

			<div class="container-fluid">
				<main>
					<slot />
				</main>
			</div>
		</div>
	</div>
</template>

<style scoped>
.page-with-sidebar {
	--sidebar-width: 256px;
	--top-bar-height: 48px;
	padding-left: 0;

	transition-property: padding;
	transition-duration: 200ms;
	transition-timing-function: ease;

	.sidebar-overlay {
		display: none;
	}

	@media (min-width: 1200px) {
		padding-left: var(--sidebar-width);
	}

	@media (max-width: 1200px) {
		.sidebar-overlay {
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 5;
			display: block;
			background-color: rgba(0, 0, 0, 0.185);
		}
	}
}

.page-with-sidebar-collapsed {
	padding-left: 0;

	.sidebar {
		transform: translate3d(-100%, 0, 0);
	}

	.sidebar-overlay {
		display: none;
	}

	.top-bar-fixed {
		left: 0;
	}
}

.content-wrapper {
	padding-top: var(--top-bar-height);
	padding-bottom: 100px;

	width: 100%;

	transition-property: padding;
	transition-duration: 200ms;
	transition-timing-function: ease;
}

.container-fluid {
	margin: 0 auto;
	padding: 0 24px;
	max-width: 1296px;
}
</style>
