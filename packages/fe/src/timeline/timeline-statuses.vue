<script setup>
import { ElTimeline, ElTimelineItem, ElTag, ElText, ElSpace } from 'element-plus';
import { ref, onMounted } from 'vue';
import { $api } from '../lib/api';
import { $notifyUserAboutError } from '../lib/utils/feedback/notify-msg';
import { convertToCustomDate } from '../lib/utils/datetime/date-format';
import { getButtonType } from '../orders/details/constants';
const props = defineProps({
	id: {
		type: String,
		default: null
	}
});
const loading = ref(false);
const requestHistory = ref(null);
const setRequest = async () => {
	loading.value = true;
	try {
		const data = await $api.requests.fetchRequestsHistory(props.id);
		console.log('data', data);
		requestHistory.value = data.histories;
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error getting history');
	} finally {
		loading.value = false;
	}
};

onMounted(() => {
	setRequest();
});
</script>

<template>
	<el-timeline>
		<el-timeline-item
			v-for="(history, index) of requestHistory"
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

:deep(.el-timeline) {
	margin-top: 40px;
}

ul {
	padding-inline-start: 2px;
}
</style>
