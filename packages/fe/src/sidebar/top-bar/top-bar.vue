<script setup>
import BreadcrumbsLinks from './breadcrumbs/breadcrumbs-links.vue';
import RhIcon from '../../lib/components/rh-icon.vue';
import BaseButton from '../sidebar-buttons/base-button.vue';

const props = defineProps({
	isSidebarCollapsed: {
		type: Boolean,
		required: true
	}
});

const emit = defineEmits(['toggle-collapse']);

function handleCollapse() {
	emit('toggle-collapse');
}
</script>

<template>
	<div class="top-bar-fixed">
		<div class="top-bar-container">
			<breadcrumbs-links>
				<template #before>
					<base-button v-if="props.isSidebarCollapsed" @click="handleCollapse">
						<rh-icon name="sidebar" />
					</base-button>
				</template>
			</breadcrumbs-links>
		</div>
	</div>
</template>

<style>
.top-bar-fixed {
	position: fixed;
	top: 0;
	right: 200px;
	left: var(--sidebar-width);

	z-index: 10;
	padding: 0 16px;
	width: 100%;

	box-shadow: 0 1px 0 0 var(--border-color);
	background-color: var(--rh-color-page-white);

	transition-property: width, left, right;
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

.top-bar-container {
	display: flex;
	align-items: center;

	gap: 2px;
	width: 100%;
	min-height: 48px;
}
</style>
