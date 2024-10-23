<script setup>
import { $router } from '../lib/router/router.js';
import { ElButton } from 'element-plus';

function goHome() {
	$router.push({ name: 'dashboard' });
}
</script>

<template>
	<div class="error-page">
		<div class="error-content">
			<div class="logo-container">
				<img width="100" height="100" src="../lib/assets/images/logo.svg" alt="" />
				<h1>404</h1>
			</div>
			<el-button type="primary" @click="goHome">Go Home</el-button>
		</div>
	</div>
</template>

<style scoped>
.error-page {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	text-align: center;
}

.error-content {
	max-width: 400px;
}

h1 {
	margin: 0;
	color: #ff4757;
	font-size: 100px;
}

p {
	margin: 10px 0;
	font-size: 20px;
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
