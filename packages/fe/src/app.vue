<script setup>
import MainLayout from './lib/router/layout/main-layout.vue';
</script>

<template>
	<component :is="$route.meta.layout || MainLayout" />
</template>
