<script setup>
import { $router } from '../lib/router/router.js';
import { ElButton } from 'element-plus';

function goHome() {
	$router.push({ name: 'dashboard' });
}

function signIn() {
	$router.push({ name: 'login' });
}
</script>

<template>
	<div class="error-page">
		<div class="error-content">
			<div class="logo-container">
				<img width="130" height="130" src="../lib/assets/images/logo.svg" alt="" />
			</div>
			<h1>404: Page not found</h1>
			<p>Make sure the address is correct and the page is not moved.</p>
			<p>Please contact your administrator if you think this is a mistake.</p>
			<el-button type="primary" @click="goHome">Go Home</el-button>
			<el-button type="primary" @click="signIn">Sign in with different account</el-button>
		</div>
	</div>
</template>

<style scoped>
.error-page {
	display: flex;
	justify-content: center;
	padding-top: 30px;
	height: 100vh;
	text-align: center;
}

h1 {
	padding: 2px;
	font-size: 25px;
}

.error-content {
	max-width: 600px;
}

p {
	margin: 10x 0;
	padding: 2px;
	font-size: 15px;
}

.logo-container {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 10px;

	.logo-title {
		margin-top: 20px;
		font-weight: 700;
		font-size: 20px;
	}
}
</style>
