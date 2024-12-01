<script setup>
import { ElTimeline, ElTimelineItem, ElSpace, ElText, ElTag } from 'element-plus';
import { ref, onMounted } from 'vue';
import { $api } from '../lib/api';
import { $notifyUserAboutError } from '../lib/utils/feedback/notify-msg';
import { convertToCustomDate } from '../lib/utils/datetime/date-format';
import { Location, Document } from '@element-plus/icons-vue';

const props = defineProps({
	id: {
		type: String,
		default: null
	},
	category: {
		type: String,
		default: null
	}
});
const loading = ref(false);
const substanceHistory = ref(null);
const setSubstance = async () => {
	loading.value = true;
	try {
		const data = await $api.substances.fetchSubstanceHistory(props.category, props.id);
		substanceHistory.value = data.histories;
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error getting history');
	} finally {
		loading.value = false;
	}
};

onMounted(() => {
	setSubstance();
});
</script>

<template>
	<el-timeline>
		<el-timeline-item
			v-for="(history, index) of substanceHistory"
			:key="index"
			v-loading="loading"
			:icon="history.actionType === 'storage-update' ? Location : Document"
			:timestamp="convertToCustomDate(history.modifiedDate)"
		>
			<el-space v-if="history.actionType === 'storage-update'">
				<el-text>
					<el-text class="bold">
						{{ history.user.userFirstName }}
						{{ history.user.userLastName }}
					</el-text>
					changed
					<el-tag effect="light" round>storage location</el-tag>
					from
					<el-text class="bold">
						{{ history.newStorageLocation.newStorageRoom }}
						{{ '-' }}
						{{ history.newStorageLocation.newStorageName }}
					</el-text>
					to
					<el-text class="bold">
						{{ history.prevStorageLocation.prevStorageRoom }}
						{{ '-' }}
						{{ history.prevStorageLocation.prevStorageName }}
					</el-text>
				</el-text>
			</el-space>
			<el-space v-if="history.actionType === 'quantity-update'">
				<el-text>
					<el-text class="bold">
						{{ history.user.userFirstName }}
						{{ history.user.userLastName }}
					</el-text>
					changed
					<el-tag type="warning" effect="light" round>quantity left</el-tag>
					from
					<el-text class="bold">
						{{ history.prevQuantityLeft }}
					</el-text>
					to
					<el-text class="bold">
						{{ history.newQuantityLeft }}
						{{}}
					</el-text>
					<el-text>
						{{ history.quantityUnit }}
						due to
					</el-text>
					<el-text tag="i">
						{{ history.changeReason }}
					</el-text>
				</el-text>
			</el-space>
		</el-timeline-item>
	</el-timeline>
</template>

<style scoped>
.bold {
	font-weight: bold;
}

:deep(.el-timeline) {
	margin-top: 40px;
}
:deep(.el-timeline-item__node) {
	width: 25px;
	height: 25px;
	background-color: #ebeced;
}

:deep(.el-timeline-item .el-timeline-item__icon) {
	color: #5d6771;
}

:deep(.el-timeline-item__node--normal) {
	top: -6px;
	left: -8px;
}

ul {
	padding-inline-start: 2px;
}
</style>
