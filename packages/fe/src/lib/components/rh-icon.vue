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

const iconsClass = computed(() => `pi pi-${props.name}`);
</script>

<template>
	<span :class="iconsClass" :style="{ color: color, fontSize: `${size}px` }"></span>
</template>
