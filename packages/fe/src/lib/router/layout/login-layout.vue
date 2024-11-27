<script setup></script>

<template>
	<div class="authentication-page">
		<div class="container">
			<div class="form">
				<router-view></router-view>
			</div>
			<div class="footer"></div>
		</div>
	</div>
</template>

<style scoped>
.authentication-page {
	height: 100vh;
}
.container {
	display: flex;
	flex-wrap: wrap;
	height: 100%;
}
.form {
	align-self: center;
	margin: 0 auto;
	width: 100%;
	max-width: 465px;
}
.footer {
	align-self: flex-end;
	padding: 30px;
	width: 100%;
}
</style>
