<script setup>
import { ElTimeline, ElTimelineItem, ElSpace, ElText, ElTag } from 'element-plus';
import { ref, onMounted } from 'vue';
import { $api } from '../lib/api';
import { $notifyUserAboutError } from '../lib/utils/feedback/notify-msg';
import { convertToCustomDate } from '../lib/utils/datetime/date-format';
import { Location, Document, Delete } from '@element-plus/icons-vue';
import { __ } from '../lib/locales/';

const props = defineProps({
	id: {
		type: String,
		default: null
	},
	category: {
		type: String,
		default: null
	},
	isDeleted: {
		type: Boolean,
		default: false
	}
});

const loading = ref(false);
const substanceHistory = ref(null);

const filteredSubstanceHistory = substanceHistory => {
	return substanceHistory.filter(history => {
		if (history.actionType === 'storage-update') {
			return history.prevStorageLocation && history.newStorageLocation;
		}
		if (history.actionType === 'quantity-update') {
			return history.prevQuantityLeft && history.newQuantityLeft;
		}
		return history.actionType === 'delete';
	});
};

const setSubstance = async () => {
	loading.value = true;
	try {
		const data = await $api.substances.fetchSubstanceHistory(props.category, props.id, {
			deleted: props.isDeleted
		});

		substanceHistory.value = filteredSubstanceHistory(data.histories);
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
	<el-text v-if="substanceHistory?.length" class="bold">{{ __('History') }}</el-text>
	<el-timeline>
		<el-timeline-item
			v-for="(history, index) of substanceHistory"
			:key="index"
			v-loading="loading"
			:icon="
				history.actionType === 'storage-update'
					? Location
					: history.actionType === 'quantity-update'
						? Document
						: Delete
			"
			:timestamp="convertToCustomDate(history.modifiedDate)"
		>
			<el-space v-if="history.actionType === 'storage-update'">
				<el-text>
					<el-text class="bold">
						{{ history.user.userFirstName }}
						{{ history.user.userLastName }}
					</el-text>
					{{ __('changed') }}
					<el-tag effect="light" round>{{ __('storage location') }}</el-tag>
					{{ __('from') }}
					<el-text class="bold">
						{{ history.prevStorageLocation.prevStorageRoom }}
						{{ '-' }}
						{{ history.prevStorageLocation.prevStorageName }}
					</el-text>
					{{ __('to') }}
					<el-text class="bold">
						{{ history.newStorageLocation.newStorageRoom }}
						{{ '-' }}
						{{ history.newStorageLocation.newStorageName }}
					</el-text>
				</el-text>
			</el-space>
			<el-space v-if="history.actionType === 'quantity-update'">
				<el-text>
					<el-text class="bold">
						{{ history.user.userFirstName }}
						{{ history.user.userLastName }}
					</el-text>
					{{ __('changed') }}
					<el-tag type="warning" effect="light" round>{{ __('quantity left') }}</el-tag>
					{{ __('from') }}
					<el-text class="bold">
						{{ history.prevQuantityLeft }}
					</el-text>
					{{ __('to') }}
					<el-text class="bold">
						{{ history.newQuantityLeft }}
						{{}}
					</el-text>
					<el-text>
						{{ history.quantityUnit }}
						{{ __('due to') }}
						{{ ' ' }}
					</el-text>
					<el-text tag="i">
						{{ history.changeReason }}
					</el-text>
				</el-text>
			</el-space>
			<el-space v-if="history.actionType === 'delete'">
				<el-text>
					<el-text class="bold">
						{{ history.user.userFirstName }}
						{{ history.user.userLastName }}
					</el-text>
					{{ ' ' }}
					<el-tag type="danger" effect="light" round>{{ __('deleted') }}</el-tag>
				</el-text>
			</el-space>
		</el-timeline-item>
	</el-timeline>
</template>

<style scoped>
.bold {
	font-weight: bold;
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
	margin-top: 20px;
	padding-inline-start: 2px;
}
</style>
