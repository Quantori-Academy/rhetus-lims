<script setup>
import SidebarMenu from '../../../sidebar/sidebar-menu.vue';
</script>

<template>
	<sidebar-menu />
	<div class="main-wrapper">
		<div class="table-logo">
			<img width="42" height="42" src="../../../lib//assets/images/logo.svg" alt="" />
		</div>
		<router-view></router-view>
	</div>
</template>

<style scoped>
.main-wrapper {
	display: grid;
	place-content: center;
	gap: 4px;
	height: 100vh;
}
.table-logo {
	display: flex;
	justify-content: center;
	margin: 20px 0;
}
</style>
