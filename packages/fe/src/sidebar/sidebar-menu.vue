<script setup>
import { ref } from 'vue';
import { ElRow, ElButton } from 'element-plus';
import RhIcon from '~/lib/components/rh-icon.vue';

const menu = ref(true);

const handleSidebarClose = () => {
	menu.value = false;
};

const handleSidebarOpen = () => {
	menu.value = true;
};
</script>

<template>
	<div :class="['sidebar', { open: menu }]">
		<nav v-if="menu" class="menu">
			<el-row class="show-row">
				<img class="logo" src="../lib/assets/images/logo.svg" />
				<el-button circle class="mobile" @click="handleSidebarClose">
					<rh-icon name="angle-left"></rh-icon>
				</el-button>
			</el-row>

			<el-row class="link">
				<router-link to="/users/:id">
					<rh-icon name="user"></rh-icon>
					<span>Profile</span>
				</router-link>
			</el-row>

			<el-row class="link">
				<router-link to="/users/list">
					<rh-icon name="users"></rh-icon>
					<span>Users List</span>
				</router-link>
			</el-row>

			<el-row class="link">
				<router-link to="/storages/list">
					<rh-icon name="building"></rh-icon>
					<span>Storages</span>
				</router-link>
			</el-row>
		</nav>
	</div>

	<div v-if="!menu" class="header">
		<el-row class="show-row">
			<el-button circle @click="handleSidebarOpen">
				<rh-icon name="angle-right"></rh-icon>
			</el-button>
		</el-row>
	</div>
</template>

<style scoped>
.sidebar {
	position: fixed;
	width: 250px;
	height: 100%;
	overflow: hidden;
	transition: width 0.3s ease;

	.menu {
		padding-top: 1rem;
		height: 100%;
		background-color: #f2f3f8;

		.link {
			padding: 0;
			height: 50px;

			&:hover {
				background-color: #c0c0c0;
			}

			a {
				display: flex;
				align-items: center;
				padding: 0 20px;
				width: 100%;
				color: #080808;
				text-decoration: none;
			}
		}
	}
	.show-row {
		justify-content: space-between;
		padding: 0 20px 40px;
		color: #080808;
		font-size: 1.5rem;
	}
	.logo {
		width: 30px;
		height: 30px;
	}
}
.mobile {
	display: none;
}
.header {
	position: fixed;
	height: 30px;
}
@media (max-width: 768px) {
	.sidebar {
		z-index: 2;
		width: 100%;
		max-width: 250px;
		transform: translateX(-250px);
		transition: transform 0.3s ease;

		&.open {
			transform: translateX(0);
		}
	}

	.mobile {
		display: inline-flex;
	}
}
</style>
