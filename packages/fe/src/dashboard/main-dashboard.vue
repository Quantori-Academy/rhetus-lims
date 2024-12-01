<script setup>
import { format } from 'date-fns';
import { inject } from 'vue';
import RhIcon from '../lib/components/rh-icon.vue';
import SubstancesAnalytics from './substances-analytics.vue';
import RequestsAnalytics from './requests-analytics.vue';
import OrdersAnalytics from './orders-analytics.vue';
import InfoCards from './info-cards.vue';
import NotificationsBox from './notifications-box.vue';

const { user, isResearcher, isOfficer } = inject('user');
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
		<div v-if="!isResearcher">
			<info-cards />
		</div>
		<div class="row">
			<div class="stats">
				<requests-analytics />
			</div>
			<notifications-box />
		</div>
		<div class="row">
			<div v-if="isOfficer" class="orders">
				<orders-analytics />
			</div>
			<div class="stats">
				<substances-analytics />
			</div>
		</div>
	</div>
</template>

<style>
.container {
	padding: 16px;
}

.container > * + * {
	margin-top: 20px;
}

.row {
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

.orders {
	display: flex;
	flex: 2;
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
</style>
