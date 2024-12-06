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
	expired: 0,
	notExpired: 0,
	expiredReagents: 0,
	expiredSamples: 0
});

function initChart() {
	if (!chartRef.value) return;

	const chartInstance = echarts.init(chartRef.value);

	const data = [
		{ value: analytics.value.expired, name: __('Expired') },
		{ value: analytics.value.notExpired, name: __('Not expired') }
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
				name: __('Substances'),
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
					formatter: () => `${analytics.value.total}\n${__('Substances')}`,
					fontSize: 14,
					fontWeight: 'bold'
				},
				labelLine: {
					show: false
				},
				data: [
					{
						value: analytics.value.total,
						name: __('Total'),
						itemStyle: { color: 'transparent' }
					}
				]
			}
		]
	};
	chartInstance.setOption(options);
}

async function getAnalytics() {
	loading.value = true;

	const categoryParams = { options: { category: 'reagent' } };
	const expiredParams = {
		options: {
			expirationDate: [new Date('0001-01-01T00:00:00.000Z'), new Date()]
		}
	};

	const promises = [
		$api.substances.fetchSubstances({}).then(({ count: total }) => (analytics.value.total = total)),
		$api.substances
			.fetchSubstances(expiredParams)
			.then(({ count: expired }) => (analytics.value.expired = expired)),
		$api.substances
			.fetchSubstances(categoryParams)
			.then(({ count: reagents }) => (analytics.value.reagents = reagents)),
		$api.substances
			.fetchSubstances({
				options: { ...expiredParams.options, category: 'reagent' }
			})
			.then(({ count: expiredReagents }) => (analytics.value.expiredReagents = expiredReagents)),
		$api.substances
			.fetchSubstances({
				options: { ...expiredParams.options, category: 'sample' }
			})
			.then(({ count: expiredSamples }) => (analytics.value.expiredSamples = expiredSamples))
	];

	await Promise.all(promises);

	analytics.value.notExpired = analytics.value.total - analytics.value.expired;

	analytics.value.samples = analytics.value.total - analytics.value.reagents;
	analytics.value.reagentsPercent = (
		(analytics.value.reagents / analytics.value.total) *
		100
	).toFixed(2);
	analytics.value.samplesPercent = (100 - analytics.value.reagentsPercent).toFixed(2);

	loading.value = false;
}

onMounted(() => {
	getAnalytics().then(() => initChart());
});
</script>

<template>
	<div v-loading="loading" class="container">
		<div class="chart-container">
			<router-link class="chart-title" to="/substances/list">
				{{ __('Expired substances') }}
				<rh-icon name="arrow-right" />
			</router-link>
			<div ref="chartRef" class="chart-container"></div>
		</div>
		<div class="stat-value-container">
			<div class="value">
				<div>
					<span class="legend legend-blue" />
					<span>{{ __('Expired') }}</span>
				</div>
				<div class="number">{{ analytics.expired }}</div>
			</div>
			<div class="value">
				<div>
					<span class="legend legend-green" />
					<span>{{ __('Not expired') }}</span>
				</div>
				<div class="number">{{ analytics.notExpired }}</div>
			</div>
			<div class="value">
				<div>
					<span>{{ __('Expired samples') }}</span>
				</div>
				<div class="number">{{ analytics.expiredSamples }}</div>
			</div>
			<div class="value">
				<div>
					<span>{{ __('Expired reagents') }}</span>
				</div>
				<div class="number">{{ analytics.expiredReagents }}</div>
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
	width: 100%;
	max-width: 300px;
	height: 280px;
}

.stat-value-container {
	width: 100%;

	.value {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 10px 0px;

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

.legend-blue {
	background-color: #5470c6;
}

.legend-green {
	background-color: #91cc75;
}
</style>
