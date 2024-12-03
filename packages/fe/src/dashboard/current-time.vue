<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { format } from 'date-fns';

const currentTime = ref(format(new Date(), 'HH:mm:ss'));

const updateCurrentTime = () => {
	currentTime.value = format(new Date(), 'HH:mm:ss');
};

onMounted(() => {
	updateCurrentTime();

	const interval = setInterval(() => {
		updateCurrentTime();
	}, 1000);

	onBeforeUnmount(() => {
		clearInterval(interval);
	});
});
</script>

<template>
	<span class="time">{{ currentTime }}</span>
</template>

<style scoped>
.time {
	width: 64px;
}
</style>
