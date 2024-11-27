<script setup>
import { ElTable, ElTableColumn, ElSelect, ElOption, ElButton, ElForm, ElTag } from 'element-plus';
import { $notifyUserAboutError, $notify } from '../../lib/utils/feedback/notify-msg';
import { computed, onMounted, ref } from 'vue';
import { $api } from '../../lib/api/index.js';
import RhIcon from '../../lib/components/rh-icon.vue';
import { $router } from '../../lib/router/router.js';
// const props = defineProps({
// 	id: {
// 		type: String,
// 		default: null
// 	}
// });
const orderId = '0c2243be-8325-41fd-bb47-3372be2eec04';
const storageAssignments = ref({}); // Separate state for storage locations
const order = ref(null);
const storages = ref([]);
const fulfilledReagents = ref([]);
const hasStorage = computed(
	() => fulfilledReagents.value.filter(item => item.storageLocation?.id) // Filter items with a non-empty id in storageLocation
);
const loading = ref(false);
onMounted(() => {
	setSubstances();
	setOrder(orderId);
	setStorages();
});

const setOrder = async id => {
	loading.value = true;
	try {
		const response = await $api.orders.fetchOrder(id);
		order.value = response;
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating order');
	} finally {
		loading.value = false;
	}
};

const setSubstances = async () => {
	loading.value = true;

	try {
		const params = {
			limiit: 200,
			options: {
				order: orderId,
				category: 'reagent'
			}
		};
		const response = await $api.substances.fetchSubstances(params);
		const filteredSubstances = response.substances.filter(
			substance => substance.orderId === orderId
		);
		fulfilledReagents.value = filteredSubstances;
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating order');
	} finally {
		loading.value = false;
	}
};
async function setStorages() {
	loading.value = true;
	try {
		const data = await $api.storages.fetchStorages();
		console.log(data.storages);
		storages.value = data.storages;
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		loading.value = false;
	}
}
// const saveChanges = async () => {
// 	const updatedReagents = fulfilledReagents.value.filter(
// 		item => item.storageLocation.id.length > 0
// 	);
// 	console.log('Updated Substances:', updatedReagents);
// 	try {
// 		const item = {
// 			...updatedReagents
// 		};
// 		const data = await $api.substances.updateSubstance(item.id, item);
// 		$notify({
// 			title: 'Success',
// 			message: 'Storage locations updated successfully',
// 			type: 'success'
// 		});
// 	} catch (error) {
// 		$notifyUserAboutError(error.message || 'Error updating storage locations');
// 	}
// };
const saveChanges = async () => {
	const updatedReagents = fulfilledReagents.value.filter(item => item.storageLocation?.id);
	try {
		const updateRequests = updatedReagents.map(item => {
			const updatePayload = {
				name: item.name,
				category: item.category,
				storageId: item.storageLocation.id
			};
			return $api.substances.updateSubstance(item.id, updatePayload);
		});
		console.log(updateRequests);
		await Promise.all(updateRequests);

		$notify({
			title: 'Success',
			message: 'All storage locations updated successfully',
			type: 'success'
		});
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating storage locations');
	}
};

const cancelChanges = () => {
	$router.push({ name: 'order-details', params: { id: order.value.id } });
};
const handleStorageChange = row => {
	console.log(
		`Storage location changed for reagent: ${row.name}, New Location: ${row.storageLocationId}`
	);
};
</script>

<template>
	<div v-if="fulfilledReagents && order" v-loading="loading" class="wrapper">
		<h2>Move substances to storages - {{ order?.title }}</h2>
		<el-form ref="form-ref" :model="fulfilledReagents" @submit.prevent="saveChanges">
			<el-table :data="fulfilledReagents">
				<el-table-column width="50">
					<template #default="{ row }">
						<rh-icon
							color="#1785be"
							:name="row.category.toLowerCase() === 'reagent' ? 'pod' : 'applications'"
						/>
					</template>
				</el-table-column>
				<el-table-column label="Name" prop="name" />
				<el-table-column label="Quantity" prop="quantity" width="100" />
				<el-table-column label="Quantity Unit" prop="quantityUnit" width="150" />
				<el-table-column label="Storage Location" width="200">
					<template #default="{ row }">
						<el-select
							v-model="storageAssignments[row.id]"
							placeholder="Select storage location"
							:loading="loading"
							filterable
							@change="() => handleStorageChange(row)"
						>
							<el-option
								v-for="storage of storages"
								:key="storage.id"
								:label="`${storage.room} - ${storage.name}`"
								:value="storage.id"
							/>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="Status" width="150">
					<el-tag size="large" type="success" effect="light">{{
						hasStorage ? `ASSIGNED` : `Not filASSIGNEDled`
					}}</el-tag>
				</el-table-column>
			</el-table>
			<div class="btn-container">
				<el-button @click="cancelChanges">Cancel</el-button>
				<el-button type="primary" @click="saveChanges">Save Changes</el-button>
			</div>
		</el-form>
	</div>
</template>

<style scoped>
.wrapper,
.el-form {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}
</style>
