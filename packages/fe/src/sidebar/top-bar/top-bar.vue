<script setup>
import SidebarButton from '../sidebar-button.vue';
import BreadcrumbsLinks from './breadcrumbs/breadcrumbs-links.vue';

const props = defineProps({
	isSidebarOpen: {
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
					<sidebar-button v-if="!props.isSidebarOpen" @click="handleCollapse" />
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

	border-bottom: 1px solid var(--border-color);
	background-color: white;

	transition-property: width, left, right;
	transition-duration: 200ms;
	transition-timing-function: ease;

	:focus,
	:focus-visible {
		box-shadow:
			0 0 0 1px #fff,
			0 0 0 3px #218ec7;
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

.breadcrumb-links-container {
	display: flex;
	flex-grow: 1;
	flex-basis: 0;
	justify-items: start;
	align-items: center;
}

.breadcrumb-links {
	ol {
		padding: 0;
	}

	li {
		display: inline;
		list-style: none;

		&::after {
			content: '/';
			padding-right: 4px;
			padding-left: 4px;
		}
	}

	.current-page::after {
		content: '';
	}
}
</style>
