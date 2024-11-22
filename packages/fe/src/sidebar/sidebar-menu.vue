<script setup>
import SidebarHeader from './sidebar-header.vue';
import SidebarNavigation from './sidebar-navigation.vue';

const emit = defineEmits(['toggle-collapse']);

function handleCollapse() {
	emit('toggle-collapse');
}
</script>

<template>
	<nav class="sidebar">
		<sidebar-header @toggle-collapse="handleCollapse" />
		<sidebar-navigation />
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

	color: var(--rh-color-black);
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
</style>
