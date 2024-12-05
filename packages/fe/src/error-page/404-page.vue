<script setup>
import { ElButton } from 'element-plus';
import { __ } from '../lib/locales/';
</script>

<template>
	<div class="logo-container">
		<img width="130" height="130" src="../lib/assets/images/logo.svg" alt="" />
	</div>
	<h1>404: {{ __('Page not found') }}</h1>
	<div class="text-box">
		<p>{{ __('Make sure the address is correct and the page is not moved') }}.</p>
		<p>{{ __('Please contact your administrator if you think this is a mistake') }}.</p>
	</div>

	<router-link to="/">
		<el-button type="primary" link>{{ __('Go Home') }}</el-button>
	</router-link>
	<router-link to="/login">
		<el-button type="primary" link>{{ __('Sign in with different account') }}</el-button>
	</router-link>
</template>

<style scoped>
h1 {
	display: flex;
	justify-content: center;
	margin-top: 48px;
	font-size: 25px;
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
