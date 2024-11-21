<script setup>
import BaseButton from './base-button.vue';
import RhIcon from '../../lib/components/rh-icon.vue';

const emit = defineEmits(['click']);

function emitClick() {
	emit('click');
}
</script>

<template>
	<base-button @click="emitClick">
		<rh-icon name="sidebar" />
	</base-button>
</template>
