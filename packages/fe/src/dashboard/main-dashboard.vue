<script setup>
import { format } from 'date-fns';
import { inject } from 'vue';
import RhIcon from '../lib/components/rh-icon.vue';
import ExpiredSubstancesAnalytics from './expired-substances-analytics.vue';
import SubstancesAnalytics from './substances-analytics.vue';
import RequestsAnalytics from './requests-analytics.vue';
import OrdersAnalytics from './orders-analytics.vue';
import InfoCards from './info-cards.vue';
import NotificationsBox from './notifications-box.vue';
import { __ } from '../lib/locales';
import CurrentTime from './current-time.vue';

const { user, isResearcher, isOfficer } = inject('user');
</script>

<template>
	<div class="container">
		<div class="header">
			<h1>{{ __('Welcome') }}, {{ user.firstName }}</h1>
			<div class="date-time">
				<div class="box">
					<rh-icon name="calendar" />
					{{ format(new Date(), `'${__('Today')}, 'dd MMM`) }}
				</div>
				<div class="box">
					<rh-icon name="clock" />
					<current-time />
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
			<div v-if="isOfficer" class="stats">
				<orders-analytics />
			</div>
			<div v-else class="stats">
				<substances-analytics />
			</div>
			<div class="stats">
				<expired-substances-analytics />
			</div>
		</div>
	</div>
</template>

<style>
.container {
	padding: 16px;

	> * + * {
		margin-top: 20px;
	}
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.date-time {
	display: flex;
	gap: 16px;

	.box {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 16px;
		border-radius: 8px;
		background-color: var(--rh-color-neutral-250);
	}
}

.row {
	display: flex;
	gap: 16px;
	height: 300px;
}

.stats {
	flex: 3;
	width: 100%;
	height: 100%;
}

@media (max-width: 900px) {
	.container {
		padding: 8px;
	}

	.date-time {
		display: none;
	}

	.row {
		display: block;
		height: 100%;

		> * + * {
			margin-top: 20px;
		}
	}
}
</style>
