<script setup>
import { ElTimeline, ElTimelineItem, ElTag, ElText, ElSpace } from 'element-plus';
import { ref, onMounted, inject } from 'vue';
import { convertToCustomDate } from '../lib/utils/datetime/date-format';
import { getButtonType } from '../orders/details/constants';

const loading = ref(false);
const { statusesHistory, setStatusesHistory } = inject('history-update');

onMounted(() => {
	setStatusesHistory();
});
</script>

<template>
	<el-text class="bold title">History</el-text>
	<el-timeline>
		<el-timeline-item
			v-for="(history, index) of statusesHistory"
			:key="index"
			v-loading="loading"
			:type="getButtonType(history.status)"
			:hollow="true"
		>
			<el-space>
				<el-tag :type="getButtonType(history.status)" effect="light" round>{{
					history.status
				}}</el-tag>
				<el-text class="bold">
					{{ history.user.userFirstName }} {{ history.user.userLastName }}
				</el-text>
				<el-text>
					updated on
					{{ convertToCustomDate(history.modifiedDate) }}
				</el-text>
				<el-text v-if="history.changeReason">
					due to
					{{ history.changeReason }}
				</el-text>
			</el-space>
		</el-timeline-item>
	</el-timeline>
</template>

<style scoped>
.bold {
	font-weight: bold;
}

:deep(.el-card__body) {
	padding: 10px;
}

:deep(.el-timeline-item__timestamp.is-top) {
	margin-bottom: 0;
}

ul {
	margin-top: 20px;
	padding-inline-start: 2px;
}
</style>
