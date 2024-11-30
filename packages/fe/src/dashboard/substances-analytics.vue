<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import { ElProgress } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
import { $api } from '../lib/api';

const chartRef = ref(null);
const analytics = ref({
	total: 0,
	expired: 0,
	notExpired: 0,
	reagents: 0,
	samples: 0,
	reagentsPercent: 0,
	samplesPercent: 0
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
			right: '10%',
			top: '10%'
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
}

onMounted(() => {
	getAnalytics().then(() => initChart());
});
</script>

<template>
	<div class="container">
		<div class="chart-container">
			<div class="chart-title">
				<div>Substances Analytics</div>
				<rh-icon name="arrow-right" />
			</div>
			<div ref="chartRef" class="chart-container"></div>
		</div>
		<div class="progress-container">
			<div class="progress">
				<div class="progress-title">
					<rh-icon name="applications" />
					<div>{{ analytics.samples }} samples</div>
				</div>
				<el-progress :percentage="analytics.samplesPercent" />
			</div>
			<div>
				<div class="progress-title">
					<rh-icon name="pod" />
					<div>{{ analytics.reagents }} reagents</div>
				</div>
				<el-progress :percentage="analytics.reagentsPercent" />
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

.progress-title {
	display: flex;
	align-items: center;
	gap: 8px;
}

.progress-container {
	width: 100%;
}

.progress {
	margin-bottom: 12px;
}
</style>
