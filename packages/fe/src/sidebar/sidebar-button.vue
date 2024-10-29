<script setup>
import { ElButton } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';

const emit = defineEmits(['click']);

function clickHandler() {
	emit('click');
}
</script>

<template>
	<el-button class="sidebar-button" @click="clickHandler">
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

	&:focus-visible {
		outline: none;
	}

	&:hover {
		background-color: var(--rh-color-neutral-350);
	}

	&:active {
		background-color: var(--bg-color-active);
	}
}
</style>
