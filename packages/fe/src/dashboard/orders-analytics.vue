<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import RhIcon from '../lib/components/rh-icon.vue';
import { $api } from '../lib/api';

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
			data: ['Pending', 'Fulfilled']
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
	const { count: total } = await $api.orders.fetchOrders({});
	analytics.value.total = total;

	const { count: pending } = await $api.orders.fetchOrders({
		options: { status: 'pending' }
	});
	analytics.value.pending = pending;

	const { count: fulfilled } = await $api.orders.fetchOrders({
		options: { status: 'fulfilled' }
	});
	analytics.value.fulfilled = fulfilled;
}

onMounted(() => {
	getAnalytics().then(() => initChart());
});
</script>

<template>
	<div class="container">
		<div class="chart-container">
			<div class="chart-title">
				<div>Orders Analytics</div>
				<rh-icon name="arrow-right" />
			</div>
			<div ref="chartRef" class="chart-container"></div>
		</div>
		<div class="values-container">
			<div class="value">
				Total
				<div class="value-number">{{ analytics.total }}</div>
			</div>
			<div class="value">
				<div>
					<span class="legend legend-pending" />
					<span>Pending</span>
				</div>
				<div class="value-number">{{ analytics.pending }}</div>
			</div>
			<div class="value">
				<div>
					<span class="legend legend-fulfilled" />
					<span>Fulfilled</span>
				</div>
				<div class="value-number">{{ analytics.fulfilled }}</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.container {
	display: flex;
	align-items: center;
	width: 100%;
	border-radius: 12px;
	background-color: var(--rh-color-neutral-250);
}

.chart-container {
	height: 300px;
}

.chart-title {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 4px 4px 0px 4px;
	font-weight: 500;
	font-size: 16px;
}

.chart-container {
	flex-grow: 1;
	margin-left: 0;
	width: 400px;
}

.values-container {
	width: 100%;
}

.value {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 12px 0px;
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

.value-number {
	font-weight: 600;
}
</style>
