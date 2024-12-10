<script setup>
import { ref, onMounted, watch, inject } from 'vue';
import { ElTable, ElTableColumn, ElButton } from 'element-plus';
import { $router } from '../lib/router/router.js';
import { $api } from '../lib/api/index.js';
import { $confirm } from '../lib/utils/feedback/confirm-msg.js';
import { $notify, $notifyUserAboutError } from '../lib/utils/feedback/notify-msg.js';
import RhPagination from '../lib/components/rh-pagination/rh-pagination.vue';
import RhFilters from '../lib/components/rh-filters/rh-filters.vue';
import SubstanceFilters from './substance-filters.vue';
import { debounce } from '../lib/utils/debounce/debounce.js';
import { __ } from '../lib/locales/index.js';
import RhIcon from '../lib/components/rh-icon.vue';

const { isOfficer } = inject('user');
const substances = ref([]);
const sortData = ref({});
const isLoading = ref(true);
const ketcherFrame = ref(null);
const filters = ref({
	name: '',
	quantity: null,
	expired: false,
	smiles: '',
	deleted: false
});

const pagination = ref({
	page: 1,
	size: 10,
	totalElements: 0
});

const handlePageChange = newPage => {
	pagination.value.page = newPage;
	setSubstances();
};
function addNewReagent() {
	$router.push({ name: 'new-reagent' });
}
function addNewSample() {
	$router.push({ name: 'new-sample' });
}
function orderReagent(row) {
	$router.push({
		name: 'new-order-substance',
		query: { id: row.id }
	});
}

function viewSubstance(row) {
	$router.push({
		name: row.category.toLowerCase() === 'reagent' ? 'reagent-details' : 'sample-details',
		params: { id: row.id },
		query: filters.value.deleted ? { deleted: filters.value.deleted } : {}
	});
}
const showNotification = (title, message, type) => {
	$notify({ title, message, type });
};
const confirmDeleteReagent = async () => {
	try {
		return await $confirm(__('Do you want to delete this item?'), __('Warning'), {
			confirmButtonText: __('OK'),
			cancelButtonText: __('Cancel'),
			type: 'warning'
		});
	} catch (error) {
		if (!['cancel', 'close'].includes(error)) {
			this.$notifyUserAboutError(error);
		}
		return false;
	}
};

const deleteSingleSubstance = async row => {
	if (!(await confirmDeleteReagent())) return;
	try {
		await $api.substances.deleteSubstance(row.category.toLowerCase(), row.id);
		showNotification(__('Success'), __('Item is deleted'), 'success');
		await setSubstances();
	} catch (error) {
		showNotification(__('Error'), error.message || __('Item update canceled'), 'error');
	}
};

const setSubstances = debounce(async () => {
	isLoading.value = true;
	const { expired, deleted, ...rest } = filters.value;
	if (filters.value.smiles) {
		sortData.value = { ...sortData.value, relevance: 'desc' };
	}
	const params = {
		...pagination.value,
		sort: sortData.value,
		options: {
			...rest,
			expirationDate: expired ? [new Date('0001-01-01T00:00:00.000Z'), new Date()] : [],
			deleted: deleted ? 'true' : 'false'
		}
	};
	try {
		const { substances: substancesData, count } = await $api.substances.fetchSubstances(params);
		substances.value = await Promise.all(
			substancesData.map(async substance => {
				const ketcher = ketcherFrame.value.contentWindow.ketcher;
				const opts = { outputFormat: 'svg' };
				const ketcherImage = substance.structure.length
					? await ketcher.generateImage(substance.structure, opts)
					: null;
				return {
					...substance,
					imageUrl: ketcherImage ? URL.createObjectURL(ketcherImage) : ''
				};
			})
		);

		pagination.value.totalElements = count;
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		isLoading.value = false;
	}
}, 200);

const handleSortChange = event => {
	const isDescending = event.order === 'descending';
	sortData.value = { [event.prop]: isDescending ? 'desc' : 'asc' };
	setSubstances();
};

watch(
	filters,
	() => {
		pagination.value.page = 1;
		setSubstances();
	},
	{ deep: true }
);

onMounted(() => {
	setSubstances();
});
</script>

<template>
	<div class="margin-table">
		<rh-filters>
			<template #action-buttons>
				<el-button type="primary" @click="addNewReagent">
					<rh-icon color="#7dcdea" name="pod" class="icon" />{{ __('Add New Reagent') }}
				</el-button>
				<el-button type="primary" @click="addNewSample">
					<rh-icon color="#7DCDEA" name="applications" class="icon" />{{ __('Add New Sample') }}
				</el-button>
			</template>

			<template #filters>
				<substance-filters v-model:filters="filters" />
			</template>
		</rh-filters>

		<el-table
			v-loading="isLoading"
			:data="substances"
			@row-click="viewSubstance"
			@sort-change="handleSortChange"
		>
			<el-table-column width="50">
				<template #default="{ row }">
					<rh-icon
						color="#1785be"
						:name="row.category.toLowerCase() === 'reagent' ? 'pod' : 'applications'"
					/>
				</template>
			</el-table-column>
			<el-table-column prop="name" min-width="150" :label="__('Name')" sortable />
			<el-table-column prop="category" min-width="120" :label="__('Category')" sortable />
			<el-table-column prop="structure" min-width="120" :label="__('Structure')" sortable>
				<template #default="{ row }">
					<img
						v-if="row.imageUrl"
						:src="row.imageUrl"
						alt="Structure Image"
						width="80"
						height="80"
					/>
				</template>
			</el-table-column>
			<el-table-column prop="quantityLeft" min-width="120" :label="__('Quantity left')">
				<template #default="{ row }">{{ row.quantityLeft }} {{ row.quantityUnit }}</template>
			</el-table-column>
			<el-table-column prop="storageLocation" min-width="140" :label="__('Storage location')">
				<template #default="{ row }"
					>{{ row.storageLocation?.name }} {{ row.storageLocation?.room }}</template
				>
			</el-table-column>
			<el-table-column v-if="isOfficer" width="60">
				<template #default="{ row }">
					<el-button type="primary" @click.stop="() => orderReagent(row)">
						<rh-icon color="white" name="file-addition" />
					</el-button>
				</template>
			</el-table-column>
			<el-table-column width="60">
				<template #default="{ row }">
					<el-button type="danger" @click.stop="() => deleteSingleSubstance(row)">
						<rh-icon color="white" name="remove" />
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<rh-pagination :pagination="pagination" @change-page="handlePageChange" />
		<div class="ketcher-editor">
			<iframe
				ref="ketcherFrame"
				src="/ketcher/index.html"
				width="100%"
				height="100%"
				frameborder="0"
				allowfullscreen
			></iframe>
		</div>
	</div>
</template>

<style scoped>
.top-buttons {
	margin-bottom: 10px;
}

.reagent__action-buttons {
	display: flex;
	flex-direction: row;
}

.ketcher-editor {
	display: none;
}

::v-deep .el-table__header-wrapper .cell {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 1px;
}
::v-deep .el-table__header-wrapper .cell .el-button {
	margin-left: 0;
	width: 1rem;
	height: 1rem;
	border: none;
}
:deep(.el-table__row):hover {
	cursor: pointer;
}
</style>
