<script setup>
import { onMounted, ref } from 'vue';
import { ElProgress } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
import { $api } from '../lib/api';
import { differenceInDays } from 'date-fns';
import { __ } from '../lib/locales';

const analytics = ref({
	total: 0,
	reagents: 0,
	samples: 0,
	reagentsPercent: 0,
	samplesPercent: 0,
	averageAge: 0
});

async function getAnalytics() {
	const { substances, count: total } = await $api.substances.fetchSubstances({ limit: 1000 });
	analytics.value.total = total;

	const now = new Date();
	const totalAge = substances.reduce(
		(sum, substance) => sum + differenceInDays(new Date(substance.expirationDate), now),
		0
	);
	analytics.value.averageAge = Math.round(totalAge / substances.length);

	const categoryParams = { options: { category: 'reagent' } };
	const { count: reagents } = await $api.substances.fetchSubstances(categoryParams);
	analytics.value.reagents = reagents;
	analytics.value.samples = total - reagents;
	analytics.value.reagentsPercent = ((reagents / total) * 100).toFixed(2);
	analytics.value.samplesPercent = (100 - analytics.value.reagentsPercent).toFixed(2);
}

onMounted(() => {
	getAnalytics();
});
</script>

<template>
	<div class="container">
		<div class="title">
			<div>{{ __('Substances analytics') }}</div>
		</div>

		<div class="progress-container">
			<div class="progress-bars">
				<div class="total">
					<div>{{ __('Total') }}</div>
					<div>{{ analytics.total }} {{ __('Substances') }}</div>
				</div>
				<div class="progress">
					<div class="progress-title">
						<rh-icon name="applications" />
						<div class="label">{{ analytics.samples }} {{ __('Samples') }}</div>
					</div>
					<el-progress :percentage="analytics.samplesPercent" class="progress-bars" />
				</div>
				<div class="progress">
					<div class="progress-title">
						<rh-icon name="pod" />
						<div class="label">{{ analytics.reagents }} {{ __('Reagents') }}</div>
					</div>
					<el-progress :percentage="analytics.reagentsPercent" class="progress-bars" />
				</div>
				<div class="total">
					<div>{{ __('Average age') }}</div>
					<div>{{ analytics.averageAge }} {{ __('Days') }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	padding: 12px;
	width: 100%;
	height: 100%;
	border-radius: 12px;
	background-color: var(--rh-color-neutral-250);
}

.total {
	display: flex;
	justify-content: space-between;
	margin-bottom: 24px;

	div {
		font-weight: 700;
	}
}

.title {
	align-self: flex-start;
	padding: 4px 4px 0px 4px;
	white-space: nowrap;
	font-weight: 500;
	font-size: 16px;
}

.progress-container {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0px 12px 12px 12px;
	width: 100%;
	height: 100%;
}

.progress-bars {
	width: 100%;
}

.label {
	white-space: nowrap;
}

.progress {
	display: flex;
	gap: 8px;
	margin-bottom: 24px;
	width: 100%;
}

.progress-title {
	display: flex;
	align-items: center;
	gap: 8px;
}
</style>
