<script setup>
import { format } from 'date-fns';
import { ElTag } from 'element-plus';
import { onMounted, ref } from 'vue';
import { $api } from '../lib/api';
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
	<div class="notifications-container">
		<div class="title">Notifications</div>
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
</template>

<style>
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
