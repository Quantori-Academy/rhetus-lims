<script setup>
import { ElButton } from 'element-plus';
</script>

<template>
	<div class="error-page">
		<div class="error-content">
			<div class="logo-container">
				<img width="130" height="130" src="../lib/assets/images/logo.svg" alt="" />
			</div>
			<h1>404: Page not found</h1>
			<div class="text-box">
				<p>Make sure the address is correct and the page is not moved.</p>
				<p>Please contact your administrator if you think this is a mistake.</p>
			</div>

			<router-link to="/">
				<el-button type="primary" link>Go Home</el-button>
			</router-link>
			<router-link to="/login">
				<el-button type="primary" link>Sign in with different account</el-button>
			</router-link>
		</div>
	</div>
</template>

<style scoped>
.error-page {
	display: flex;
	justify-content: center;
	align-items: flex-start;
	padding-top: 160px;
	height: 100vh;
	text-align: center;
}

h1 {
	padding: 15px;
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

.text-box {
	padding: 10px;
}

.logo-container {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 10px;
}

.el-button {
	margin: 5px;
	width: 45%;
}
</style>
