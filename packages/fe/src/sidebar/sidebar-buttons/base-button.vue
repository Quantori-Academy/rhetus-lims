<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['click']);

function onClick(event) {
	emit('click', event);
}
</script>

<template>
	<button class="base-button" @click="onClick">
		<slot />
	</button>
</template>

<style scoped>
.base-button {
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 6px;
	width: auto;
	height: auto;
	border: none;
	border-radius: 4px;
	background: transparent;
	color: inherit;
	text-decoration: none;
	transition:
		box-shadow 0.2s ease-in-out,
		background-color 0.2s ease-in-out;
}

.base-button:focus-visible {
	box-shadow:
		0 0 0 2px var(--rh-color-page-white),
		0 0 0 4px var(--rh-color-primary-600);
	outline: none;
}
.base-button:active {
	background-color: var(--bg-color-active);
}
.base-button:hover {
	background-color: var(--rh-color-neutral-350);
}
</style>
