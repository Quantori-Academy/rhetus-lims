<script setup>
import { format } from 'date-fns';
import { ElTag } from 'element-plus';
import { onMounted, ref } from 'vue';
import { $api } from '../lib/api';
import { __ } from '../lib/locales';

const loading = ref(false);
const notifications = ref({ notifications: [], count: 0 });

async function setNotifications() {
	loading.value = true;
	const data = await $api.notifications.fetchNotifications({ createdat: 'desc' });
	notifications.value = data;
	loading.value = false;
}

onMounted(() => {
	setNotifications();
});
</script>

<template>
	<div v-loading="loading" class="notifications-container">
		<div class="title">{{ __('Notifications') }}</div>
		<div class="content">
			<div v-for="n of notifications.notifications" :key="n.id" class="list-item">
				<p>{{ n.message }}</p>
				<div class="footer">
					<div class="time">
						{{ format(new Date(n.createdAt), 'dd MMM yyyy, HH:mm') }}
					</div>
					<el-tag size="small" :type="n.requestId !== '' ? 'primary' : 'success'">
						{{ n.requestId !== '' ? __('New request update') : __('New order update') }}
					</el-tag>
				</div>
			</div>
			<div v-if="notifications.count === 0">{{ __('No notifications') }}</div>
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

	.title {
		padding: 20px 20px 0px 20px;
		font-weight: 500;
		font-size: 16px;
	}

	.content {
		padding: 24px;
	}

	.list-item {
		margin-bottom: 12px;
		padding: 12px;
		border-radius: 10px;
		background-color: var(--rh-color-neutral-200);

		.footer {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 8px;
		}

		.time {
			opacity: 0.6;
			text-align: end;
			font-size: smaller;
		}
	}
	.list-item:hover {
		background-color: var(--rh-color-neutral-300);
	}
}
</style>
