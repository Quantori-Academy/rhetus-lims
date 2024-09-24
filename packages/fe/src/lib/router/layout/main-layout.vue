<template>
	<div class="main-wrapper">
		<div class="table-logo">
			<img width="42" height="42" src="../../../lib//assets/images/logo.svg" alt="" />
		</div>
		<nav class="main-navigation">
			<router-link to="/">Table</router-link>
			<router-link to="/form">Form</router-link>
			<router-link to="/users/list">Users</router-link>
			<router-link to="/user-details">User Details</router-link>
		</nav>
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
.main-navigation {
	display: flex;
	justify-content: center;
	gap: 4px;
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
