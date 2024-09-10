<script setup>
import MainLayout from './lib/router/layout/main-layout.vue';
</script>

<template>
	<main-layout />
</template>

<style scoped>
header {
	max-height: 100vh;
	line-height: 1.5;
}

.logo {
	display: block;
	margin: 0 auto 2rem;
}

nav {
	margin-top: 2rem;
	width: 100%;
	text-align: center;
	font-size: 12px;
}

nav a.router-link-exact-active {
	color: var(--color-text);
}

nav a.router-link-exact-active:hover {
	background-color: transparent;
}

nav a {
	display: inline-block;
	padding: 0 1rem;
	border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
	border: 0;
}

@media (min-width: 1024px) {
	header {
		place-items: center;
		display: flex;
		padding-right: calc(var(--section-gap) / 2);
	}

	.logo {
		margin: 0 2rem 0 0;
	}

	header .wrapper {
		place-items: flex-start;
		display: flex;
		flex-wrap: wrap;
	}

	nav {
		margin-top: 1rem;
		margin-left: -1rem;

		padding: 1rem 0;
		text-align: left;
		font-size: 1rem;
	}
}
</style>
