<script setup>
import { ElButton } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
</script>

<template>
	<el-button class="sidebar-button">
		<rh-icon name="sidebar" size="20" />
	</el-button>
</template>

<style scoped>
button {
	padding: 6px;
	width: auto;
	height: auto;
	border: none;
	background: transparent;
	color: red;

	&:focus-visible {
		outline: none;
	}

	&:hover {
		background-color: #d6d5d9;
	}

	&:active {
		background-color: var(--bg-color-active);
	}
}
</style>
