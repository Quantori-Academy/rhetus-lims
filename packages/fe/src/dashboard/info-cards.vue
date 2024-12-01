<script setup>
import { inject, onMounted, ref } from 'vue';
import { ElBadge } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
import { $api } from '../lib/api';
import { __ } from '../lib/locales';
import { $router } from '../lib/router/router';

const { isAdmin, isOfficer } = inject('user');

const analytics = ref([]);

async function getAnalytics() {
	const { count: substances } = await $api.substances.fetchSubstances({});
	analytics.value.push({
		value: substances,
		icon: 'issue-type-test-case',
		text: __('Total substances'),
		redirect: '/substances/list'
	});

	if (isAdmin.value) {
		const users = await $api.users.fetchUsers({ limit: 1000 });
		analytics.value.push({
			value: users.count,
			icon: 'user',
			text: __('Total users'),
			redirect: '/users/list'
		});

		analytics.value.push({
			value: users.users.reduce((acc, u) => (u.hasPasswordResetRequests ? acc + 1 : acc), 0),
			icon: 'approval',
			text: __('Password reset requests'),
			redirect: '/users/list'
		});
	}

	if (isOfficer.value) {
		const { count: orders } = await $api.orders.fetchOrders({});
		analytics.value.push({
			value: orders,
			icon: 'container-image',
			text: __('Total orders'),
			redirect: '/orders/list'
		});

		const { count: requests } = await $api.requests.fetchRequests({});
		analytics.value.push({
			value: requests,
			icon: 'book',
			text: __('Total requests'),
			redirect: '/requests/list'
		});
	}
}

onMounted(() => {
	getAnalytics();
});
</script>

<template>
	<div class="info-box-container">
		<div v-for="x of analytics" :key="x.text" class="box" @click="() => $router.push(x.redirect)">
			<div class="icon">
				<el-badge :value="x.value" type="primary" :max="1000">
					<rh-icon :name="x.icon" color="#36386e" size="32" class="icon" />
				</el-badge>
			</div>
			<div class="text">{{ x.text }}</div>
		</div>
	</div>
</template>

<style scoped>
.info-box-container {
	display: flex;
	gap: 16px;
	width: 100%;
	.box {
		cursor: pointer;
		flex: 1;
		padding: 36px;
		border-radius: 12px;
		background-color: var(--rh-color-neutral-250);
		text-align: center;
	}
	.box:hover {
		background-color: #ecf1f8;
		transition: all 500ms ease-in-out;
	}
}

.icon {
	margin-bottom: 8px;
	padding: 2px;
}

@media (max-width: 600px) {
	.info-box-container {
		display: block;

		.box {
			margin-bottom: 12px;
			padding: 18px;
		}
	}
}
</style>
