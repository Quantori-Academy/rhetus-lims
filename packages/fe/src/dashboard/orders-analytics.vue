<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import { $api } from '../lib/api';
import { __ } from '../lib/locales';
import RhIcon from '../lib/components/rh-icon.vue';
import { RouterLink } from 'vue-router';

const loading = ref(false);
const chartRef = ref(null);
const analytics = ref({
	total: 0,
	pending: 0,
	fulfilled: 0
});

function initChart() {
	const chartInstance = echarts.init(chartRef.value);

	const options = {
		xAxis: {
			type: 'category',
			data: [__('Pending'), __('Fulfilled')]
		},
		yAxis: {
			type: 'value'
		},
		series: [
			{
				data: [
					{
						value: analytics.value.pending
					},
					{
						value: analytics.value.fulfilled,
						itemStyle: { color: '#91cc75' }
					}
				],
				type: 'bar'
			}
		]
	};
	chartInstance.setOption(options);
}

async function getAnalytics() {
	loading.value = true;

	const promises = [
		$api.orders.fetchOrders({}).then(({ count: total }) => (analytics.value.total = total)),
		$api.orders
			.fetchOrders({
				options: { status: 'pending' }
			})
			.then(({ count: pending }) => (analytics.value.pending = pending)),

		$api.orders
			.fetchOrders({
				options: { status: 'fulfilled' }
			})
			.then(({ count: fulfilled }) => (analytics.value.fulfilled = fulfilled))
	];

	await Promise.all(promises);

	loading.value = false;
}

onMounted(() => {
	getAnalytics().then(() => initChart());
});
</script>

<template>
	<div v-loading="loading" class="container">
		<div class="chart-container">
			<router-link class="chart-title" to="/orders/list">
				{{ __('Order analytics') }}
				<rh-icon name="arrow-right" />
			</router-link>
			<div ref="chartRef" class="chart-container"></div>
		</div>
		<div class="stat-value-container">
			<div class="value">
				{{ __('Total') }}
				<div class="number">{{ analytics.total }}</div>
			</div>
			<div class="value">
				<div>
					<span class="legend legend-pending" />
					<span>{{ __('Pending') }}</span>
				</div>
				<div class="number">{{ analytics.pending }}</div>
			</div>
			<div class="value">
				<div>
					<span class="legend legend-fulfilled" />
					<span>{{ __('Fulfilled') }}</span>
				</div>
				<div class="number">{{ analytics.fulfilled }}</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.container {
	display: flex;
	align-items: center;
	width: 100%;
	height: 100%;
	border-radius: 12px;
	background-color: var(--rh-color-neutral-250);
}

.chart-title {
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 4px 4px 0px 4px;
	color: var(--rh-color-black);
	text-decoration: none;
	font-weight: 500;
	font-size: 16px;
}

.chart-title:hover {
	color: var(--rh-color-primary-700);
	transition: all 300ms ease-in-out;
}

.chart-container {
	flex-grow: 1;
	margin-left: 0;
	width: 300px;
	height: 280px;
}

.stat-value-container {
	width: 100%;

	.value {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 12px 0px;

		.number {
			font-weight: 600;
		}
	}
}

.legend {
	display: inline-block;
	margin-right: 8px;
	width: 12px;
	height: 12px;
	border-radius: 50%;
}

.legend-pending {
	background-color: #5470c6;
}

.legend-ordered {
	background-color: #fac858;
}

.legend-fulfilled {
	background-color: #91cc75;
}

.legend-cancelled {
	background-color: #ee6666;
}

@media (max-width: 600px) {
	.stat-value-container {
		.value {
			display: none;
		}
	}
}
</style>
