<script setup>
import SidebarMenu from '../../../sidebar/sidebar-menu.vue';
</script>

<template>
	<sidebar-menu />
	<div class="main-wrapper">
		<div class="table-logo">
			<img width="42" height="42" src="../../../lib//assets/images/logo.svg" alt="" />
		</div>
		<nav class="main-navigation">
			<router-link to="/">Table</router-link>
			<router-link to="/form">Form</router-link>
			<router-link to="/users/list">Users</router-link>
			<router-link to="/users/:id">User Details</router-link>
			<router-link to="/users/list">Users</router-link>
			<router-link to="/storages/list">Storage Locations</router-link>
		</nav>
		<router-view></router-view>
	</div>
</template>

<style scoped>
.main-wrapper {
	display: grid;
	place-content: center;
	gap: 4px;
}

.main-navigation {
	display: flex;
	justify-content: center;
	gap: 10px;
	margin-bottom: 20px;

	a {
		color: black;
		font-size: 16px;
	}
}

.table-logo {
	display: flex;
	justify-content: center;
	margin: 20px 0;
}
</style>
