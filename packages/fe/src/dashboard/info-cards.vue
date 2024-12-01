<script setup>
import { inject, onMounted, ref } from 'vue';
import { ElBadge } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
import { $api } from '../lib/api';
import { __ } from '../lib/locales';

const { isAdmin, isOfficer } = inject('user');

const analytics = ref([]);

async function getAnalytics() {
	const { count: substances } = await $api.substances.fetchSubstances({});
	analytics.value.push({
		value: substances,
		icon: 'issue-type-test-case',
		text: __('Total substances')
	});

	if (isAdmin.value) {
		const users = await $api.users.fetchUsers({});
		analytics.value.push({ value: users.count, icon: 'user', text: __('Total users') });

		analytics.value.push({
			value: users.users.reduce((acc, u) => (u.hasPasswordResetRequests ? acc + 1 : acc), 0),
			icon: 'approval',
			text: __('Password reset requests')
		});
	}

	if (isOfficer.value) {
		const orders = await $api.orders.fetchOrders({});
		analytics.value.push({
			value: orders.count,
			icon: 'container-image',
			text: __('Total orders')
		});

		const requests = await $api.requests.fetchRequests({});
		analytics.value.push({ value: requests.count, icon: 'book', text: __('Total requests') });
	}
}

onMounted(() => {
	getAnalytics();
});
</script>

<template>
	<div class="info-box-container">
		<div v-for="x of analytics" :key="x.text" class="box">
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
.icon {
	padding: 2px;
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

.icon {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 4px;
	margin-bottom: 8px;
}
</style>
