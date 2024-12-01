<script setup>
import { onMounted, ref } from 'vue';
import { ElProgress } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
import { $api } from '../lib/api';
import { differenceInDays } from 'date-fns';
import { __ } from '../lib/locales';
import { RouterLink } from 'vue-router';

const loading = ref(false);
const analytics = ref({
	total: 0,
	reagents: 0,
	samples: 0,
	reagentsPercent: 0,
	samplesPercent: 0,
	averageAge: 0
});

async function getAnalytics() {
	loading.value = true;

	const categoryParams = { options: { category: 'reagent' } };
	const promises = [
		$api.substances.fetchSubstances({ limit: 1000 }).then(({ substances, count: total }) => {
			analytics.value.total = total;
			const now = new Date();
			const totalAge = substances.reduce(
				(sum, substance) => sum + differenceInDays(new Date(substance.expirationDate), now),
				0
			);
			analytics.value.averageAge = Math.round(totalAge / substances.length);
		}),
		$api.substances.fetchSubstances(categoryParams).then(({ count: reagents }) => {
			analytics.value.reagents = reagents;
		})
	];

	await Promise.all(promises);

	analytics.value.samples = analytics.value.total - analytics.value.reagents;
	analytics.value.reagentsPercent = (
		(analytics.value.reagents / analytics.value.total) *
		100
	).toFixed(2);
	analytics.value.samplesPercent = (100 - analytics.value.reagentsPercent).toFixed(2);
	loading.value = false;
}

onMounted(() => {
	getAnalytics();
});
</script>

<template>
	<div v-loading="loading" class="container">
		<router-link class="title" to="/substances/list">
			{{ __('Substances analytics') }}
			<rh-icon name="arrow-right" />
		</router-link>
		<div class="progress-container">
			<div class="progress-bar">
				<div class="count">
					<div>{{ __('Total') }}</div>
					<div>{{ analytics.total }} {{ __('Substances') }}</div>
				</div>
				<div class="item">
					<div class="title">
						<rh-icon name="applications" />
						<div class="label">{{ analytics.samples }} {{ __('Samples') }}</div>
					</div>
					<el-progress :percentage="analytics.samplesPercent" class="progress-bar" />
				</div>
				<div class="item">
					<div class="title">
						<rh-icon name="pod" />
						<div class="label">{{ analytics.reagents }} {{ __('Reagents') }}</div>
					</div>
					<el-progress :percentage="analytics.reagentsPercent" class="progress-bar" />
				</div>
				<div class="count">
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

	.count {
		display: flex;
		justify-content: space-between;
		margin-bottom: 24px;

		div {
			font-weight: 700;
		}
	}

	.title {
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 4px 4px 0px 4px;
		color: var(--rh-color-black);
		text-decoration: none;
		white-space: nowrap;
		font-weight: 500;
		font-size: 16px;
	}

	.title:hover {
		color: var(--rh-color-primary-700);
		transition: all 300ms ease-in-out;
	}
}

.progress-container {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0px 12px 12px 12px;
	width: 100%;
	height: 100%;

	.item {
		display: flex;
		gap: 8px;
		margin-bottom: 24px;
		width: 100%;

		.title {
			display: flex;
			align-items: center;
			gap: 8px;

			.label {
				white-space: nowrap;
			}
		}
	}
	.progress-bar {
		width: 100%;
	}
}
</style>
