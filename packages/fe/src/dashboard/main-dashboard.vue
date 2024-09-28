<script setup>
import 'primeicons/primeicons.css';
import { ElTable, ElTableColumn, ElMenu, ElIcon, ElRow, ElMenuItem, ElButton} from 'element-plus';
import { onMounted, ref } from 'vue';
import { $api } from '../lib/api';

const data = ref([]);

onMounted(async () => {
	const response = await $api.cities.fetchCity(1);
	data.value = [response.city];
});

const menu = ref(true);

const handleClose = () => {
	menu.value = false;
}

const handleOpen = () => {
	menu.value = true;
}
</script>

<template>
	<div :class="['sidebar', { closed: !menu, open: menu }]" >
		<el-menu v-if="menu"
			active-text-color="#ffd04b"
			class="el-menu-vertical"		
		>
			<el-row class="show-row">
				<img class="logo" src="../lib/assets/images/logo.svg"/>
				<el-button @click="handleClose" circle class="mobile">
					<i class="pi pi-angle-left"></i>
				</el-button>
			</el-row>
			
			<el-menu-item >
				<router-link to="/profile">
					<el-icon><i class="pi pi-user"></i></el-icon>
					<span>Profile</span>
				</router-link>
			</el-menu-item>
			<el-menu-item>
				<router-link to="/user-list">
					<el-icon><i class="pi pi-users"></i></el-icon>
					<span>Users List</span>
				</router-link>
			</el-menu-item>
			<el-menu-item>
				<router-link to="/user-details">
					<el-icon><i class="pi pi-user-edit"></i></el-icon>
					<span>User Detail Page</span>
				</router-link>
			</el-menu-item>
			<el-menu-item >
				<router-link to="/add-new-user">
					<el-icon><i class="pi pi-user-plus"></i></el-icon>
					<span>Add New User</span>
				</router-link>
			</el-menu-item>
		</el-menu>
	</div>

	<div v-if="!menu" class="header">
		<el-row class="show-row">
			<el-button @click="handleOpen" circle>
				<i class="pi pi-angle-right"></i>
			</el-button>
		</el-row>
	</div>
    	
	<div class="wrapper">
		<h1>This is Dashboard</h1>
		<el-table :data="data" stripe>
			<el-table-column prop="name" label="Name" />
			<el-table-column prop="id" label="Id" />
			<el-table-column prop="popularity" label="Popularity" width="100" />
		</el-table>
	</div>
</template>

<style scoped>
.sidebar {
	transition: width 0.3s ease;
	width: 250px;
	height: 100%;
	position: fixed;
	overflow: hidden;

	.el-menu-vertical {
		padding-top: 1rem;
		height: 100%;
		background-color: #f2f3f8;

		span {
			color: #080808;
			font-size: 1rem;
			font-weight: 500;
		}

		.el-menu-item {
			padding: 0;
			height: 50px;

			&:hover {
				background-color: #c0c0c0;
			}

			a {
				padding: 0 20px;
				width: 100%;
				display: flex;
				align-items: center;
				text-decoration: none;
				color: #080808;
			}
		}
	}

	.show-row {
		padding: 0 20px 20px;
		justify-content: space-between;
		color: #080808;
		font-size: 1.5rem
	}

	.logo {
		width: 30px;
		height: 30px;
	}
}

.mobile {
	display: none;
}

.sidebar.closed {
	width: 0;
}

.wrapper {
	margin-left: 250px;
	transition: margin-left 0.3s ease;
	display: grid;
	place-content: center;
	gap: 24px;
}

.header {
	position: fixed;
	height: 30px;
}

@media (max-width: 768px) {
	.sidebar {
		width: 100%;
		max-width: 250px;
		z-index: 2;
		transform: translateX(-250px);
		transition: transform 0.3s ease;

		&.closed {
			transform: translateX(-250px);
		}

		&.open {
			transform: translateX(0);
		}
	}

	.wrapper {
		width: 100%;
		margin-left: 0px;
	}
	.mobile {
		display: inline-block;
	}
}
</style>
