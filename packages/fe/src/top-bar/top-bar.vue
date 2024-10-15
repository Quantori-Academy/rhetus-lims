<script>
import { $route } from '../lib/router/router.js';
</script>

<template>
	<div class="top-bar-container">home / {{ $route.name }}</div>
</template>

<style>
.top-bar-container {
	position: fixed;
	display: flex;
	padding: 15px 0;
	padding-left: 24px;
	width: 100%;
	border-bottom: 1px solid #e1e0e4;
}
</style>
