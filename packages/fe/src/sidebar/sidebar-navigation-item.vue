<script setup>
import RhIcon from '../lib/components/rh-icon.vue';
const props = defineProps({
	isActive: {
		type: Boolean,
		required: true
	},
	link: {
		type: Object,
		required: true
	}
});
</script>

<template>
	<li :class="{ 'active-route': props.isActive }">
		<router-link :to="link.path">
			<div class="active-route-marker"></div>
			<rh-icon class="icon" :name="link.icon" />
			<span class="route-name">{{ link.name }}</span>
			<rh-icon name="chevron-right" />
		</router-link>
	</li>
</template>

<style scoped>
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

	.icon {
		margin: 0 4px;
	}

	a {
		position: relative;
		display: flex;
		justify-content: start;
		align-items: center;
		gap: 8px;
		padding: 4px 8px;
		min-height: 32px;

		border-radius: 4px;

		color: inherit;
		line-height: 21px;
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
	}
}
:focus,
:focus-visible {
	box-shadow:
		0 0 0 1px var(--rh-color-page-white),
		0 0 0 3px var(--rh-color-primary-600);
	outline: none;
}
</style>
