<script setup>
import { ref } from 'vue';
import SidebarMenu from './sidebar-menu.vue';
import TopBar from './top-bar/top-bar.vue';

const isSidebarOpen = ref(true);

function handleToggle() {
	isSidebarOpen.value = !isSidebarOpen.value;
}
</script>

<template>
	<div class="page-with-sidebar" :class="{ 'page-with-sidebar-collapsed': !isSidebarOpen }">
		<sidebar-menu @toggle-collapse="handleToggle" />

		<div class="content-wrapper">
			<top-bar :is-sidebar-open="isSidebarOpen" @toggle-collapse="handleToggle" />

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
	--bg-color: var(--color-sidebar-bg);
	--border-color: #05050614;
	--bg-color-active: var(--color-sidebar-bg-active);
	--text-color: #38485b;

	padding-left: 0;

	transition-property: padding;
	transition-duration: 200ms;
	transition-timing-function: ease;

	@media (min-width: 1200px) {
		padding-left: var(--sidebar-width);
	}
}

.page-with-sidebar-collapsed {
	padding-left: 0;

	.sidebar {
		transform: translate3d(-100%, 0, 0);
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
