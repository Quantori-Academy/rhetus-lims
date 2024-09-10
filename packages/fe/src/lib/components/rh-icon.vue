<script setup>
import { computed } from 'vue';

const props = defineProps({
	name: {
		type: String,
		required: true
	},
	color: {
		type: String,
		default: '#333'
	},
	size: {
		type: String,
		default: '24'
	}
});

const symbolId = computed(() => `/spritemap.svg#${props.name}`);
</script>

<template>
	<svg :width="size" :height="size" :style="{ fill: color }">
		<use :xlink:href="symbolId"></use>
	</svg>
</template>
