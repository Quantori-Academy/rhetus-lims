<script setup>
import { format } from 'date-fns';
import { inject, onMounted, ref } from 'vue';
import RhIcon from '../lib/components/rh-icon.vue';
import { ElTag } from 'element-plus';
import { $api } from '../lib/api';
import SubstancesAnalytics from './substances-analytics.vue';
import RequestsAnalytics from './requests-analytics.vue';
import OrdersAnalytics from './orders-analytics.vue';

const { user } = inject('user');
const notifications = ref({ notifications: [], count: 0 });

async function setNotifications() {
	const data = await $api.notifications.fetchNotifications({ createdat: 'desc' });
	notifications.value = data;
}

onMounted(() => {
	setNotifications();
});
</script>

<template>
	<div class="container">
		<div class="header">
			<h1>Welcome, {{ user.firstName }}</h1>
			<div class="date-time">
				<div class="box">
					<rh-icon name="calendar" />
					{{ format(new Date(), "'Today, 'dd MMM") }}
				</div>
				<div class="box">
					<rh-icon name="clock" />
					{{ format(new Date(), 'HH:mm') }}
				</div>
			</div>
		</div>
		<div class="info-box-container">
			<div class="box">
				<div>
					<rh-icon name="approval" color="#4c8fd2" size="28" />
				</div>
				<div class="text">Pending password reset requests</div>
			</div>
			<div class="box">
				<div>
					<rh-icon name="approval" color="#4c8fd2" size="28" />
				</div>
				<div class="text">Pending password reset requests</div>
			</div>
			<div class="box">
				<div>
					<rh-icon name="approval" color="#4c8fd2" size="28" />
				</div>
				<div class="text">Pending password reset requests</div>
			</div>
		</div>
		<div class="stats-notification-container">
			<div class="stats">
				<substances-analytics />
			</div>
			<div class="notifications-container">
				<div class="title">
					<rh-icon name="notifications" color="#4c8fd2" size="18" />
					Notifications
				</div>
				<div class="content">
					<div v-for="n of notifications.notifications" :key="n.id" class="list-item">
						<p>{{ n.message }}</p>
						<div class="footer">
							<div class="time">
								{{ format(new Date(n.createdAt), 'dd MMM yyyy, HH:mm') }}
							</div>
							<el-tag size="small" :type="n.requestId !== '' ? 'primary' : 'success'">
								{{ n.requestId !== '' ? 'New request update' : 'New order update' }}
							</el-tag>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="stats">
				<requests-analytics />
			</div>
			<div class="stats">
				<orders-analytics />
			</div>
		</div>
	</div>
</template>

<style>
.row {
	display: flex;
	gap: 12px;
}

.container {
	padding: 16px;
}

.container > * + * {
	margin-top: 20px;
}

.stats-notification-container {
	display: flex;
	gap: 16px;
	height: 300px;
}

.stats {
	display: flex;
	flex: 3;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.date-time {
	display: flex;
	gap: 16px;
}

.date-time .box {
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 8px 16px;
	border-radius: 8px;
	background-color: var(--rh-color-neutral-250);
}

.info-box-container {
	display: flex;
	gap: 16px;
	width: 100%;
}

.info-box-container .box {
	flex: 1;
	padding: 36px;
	border-radius: 12px;
	background-color: var(--rh-color-neutral-250);
	text-align: center;
}

.info-box-container .box .text {
	margin-top: 12px;
}

.stats-notification-container {
	display: flex;
	justify-content: space-between;
}

.notifications-container {
	flex: 2;
	height: 100%;
	overflow: auto;
	border-radius: 12px;
	background-color: var(--rh-color-neutral-250);
}

.notifications-container .title {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 20px 20px 0px 20px;
	font-weight: 500;
	font-size: 16px;
}

.notifications-container .content {
	padding: 24px;
}

.notifications-container .content > * + * {
	margin-top: 12px;
}

.notifications-container .list-item {
	padding: 12px;
	border-radius: 10px;
	background-color: var(--rh-color-neutral-200);
}

.notifications-container .list-item:hover {
	background-color: var(--rh-color-neutral-300);
}

.notifications-container .list-item .footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 8px;
}

.notifications-container .list-item .time {
	opacity: 0.6;
	text-align: end;
	font-size: smaller;
}
</style>
