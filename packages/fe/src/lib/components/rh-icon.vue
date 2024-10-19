<script setup>
import { computed } from 'vue';

const props = defineProps({
	name: {
		type: String,
		required: true
	},
	color: {
		type: String,
		default: '#38485b'
	},
	size: {
		type: String,
		default: '24'
	},
	angle: {
		type: String,
		default: '0deg'
	}
});

const symbolId = computed(() => `/spritemap.svg#${props.name}`);
</script>

<template>
	<svg :width="size" :height="size" :style="{ fill: color, transform: `rotate(${angle})` }">
		<use :xlink:href="symbolId"></use>
	</svg>
</template>
