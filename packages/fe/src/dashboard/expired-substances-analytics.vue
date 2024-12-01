<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import { $api } from '../lib/api';

const chartRef = ref(null);
const analytics = ref({
	total: 0,
	expired: 0,
	notExpired: 0,
	expiredReagents: 0,
	expiredSamples: 0
});

function initChart() {
	const chartInstance = echarts.init(chartRef.value);

	const data = [
		{ value: analytics.value.expired, name: 'Expired' },
		{ value: analytics.value.notExpired, name: 'Not expired' }
	];

	const options = {
		tooltip: {
			trigger: 'item'
		},
		legend: {
			right: '0%',
			top: '5%'
		},
		series: [
			{
				name: 'Substances',
				type: 'pie',
				radius: ['30%', '50%'],
				center: ['30%', '50%'],
				label: {
					show: false
				},
				data: data
			},
			{
				type: 'pie',
				radius: ['0%', '30%'],
				center: ['30%', '50%'],
				label: {
					position: 'center',
					show: true,
					formatter: () => `${analytics.value.total}\nSubstances`,
					fontSize: 14,
					fontWeight: 'bold'
				},
				labelLine: {
					show: false
				},
				data: [{ value: analytics.value.total, name: 'Total', itemStyle: { color: 'transparent' } }]
			}
		]
	};
	chartInstance.setOption(options);
}

async function getAnalytics() {
	const { count: total } = await $api.substances.fetchSubstances({});
	analytics.value.total = total;
	const expiredParams = {
		options: {
			expirationDate: [new Date('0001-01-01T00:00:00.000Z'), new Date()]
		}
	};

	const { count: expired } = await $api.substances.fetchSubstances(expiredParams);
	analytics.value.expired = expired;
	analytics.value.notExpired = total - expired;

	const categoryParams = { options: { category: 'reagent' } };
	const { count: reagents } = await $api.substances.fetchSubstances(categoryParams);
	analytics.value.reagents = reagents;
	analytics.value.samples = total - reagents;
	analytics.value.reagentsPercent = ((reagents / total) * 100).toFixed(2);
	analytics.value.samplesPercent = (100 - analytics.value.reagentsPercent).toFixed(2);

	const { count: expiredReagents } = await $api.substances.fetchSubstances({
		options: { ...expiredParams.options, category: 'reagent' }
	});
	analytics.value.expiredReagents = expiredReagents;

	const { count: expiredSamples } = await $api.substances.fetchSubstances({
		options: { ...expiredParams.options, category: 'sample' }
	});
	analytics.value.expiredSamples = expiredSamples;
}

onMounted(() => {
	getAnalytics().then(() => initChart());
});
</script>

<template>
	<div class="container">
		<div class="chart-container">
			<div class="chart-title">
				<div>Expired Substances</div>
			</div>
			<div ref="chartRef" class="chart-container"></div>
		</div>
		<div class="values-container">
			<div class="value">
				<div>
					<span class="legend legend-blue" />
					<span>Expired</span>
				</div>
				<div class="value-number">{{ analytics.expired }}</div>
			</div>
			<div class="value">
				<div>
					<span class="legend legend-green" />
					<span>Not expired</span>
				</div>
				<div class="value-number">{{ analytics.notExpired }}</div>
			</div>
			<div class="value">
				<div>
					<span>Expired Samples</span>
				</div>
				<div class="value-number">{{ analytics.expiredSamples }}</div>
			</div>
			<div class="value">
				<div>
					<span>Expired Reagents</span>
				</div>
				<div class="value-number">{{ analytics.expiredReagents }}</div>
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

.chart-container {
	height: 280px;
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
	width: 100%;
	max-width: 300px;
}

.values-container {
	width: 100%;
}
.value {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 10px 0px;
}

.legend {
	display: inline-block;
	margin-right: 8px;
	width: 12px;
	height: 12px;
	border-radius: 50%;
}

.legend-blue {
	background-color: #5470c6;
}

.legend-green {
	background-color: #91cc75;
}

.value-number {
	font-weight: 600;
}
</style>
