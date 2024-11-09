<script setup>
import { ref, useTemplateRef } from 'vue';
import { ElForm, ElFormItem, ElInput, ElInputNumber, ElButton } from 'element-plus';
import { requiredRule } from '../../reagents/details-reagent/constants';
import { $router } from '../../lib/router/router';

const formEl = useTemplateRef('form-el');
const form = ref({
	reagentName: '',
	structure: '',
	casNumber: '',
	quantity: 1,
	userComment: ''
});
const rules = ref({
	reagentName: [requiredRule('Reagent Name')],
	quantity: [requiredRule('Desired Quantity')]
});

const cancel = () => {
	formEl.value.resetFields();
	$router.push({ name: 'requests-list' });
};
</script>

<template>
	<div class="wrapper">
		<el-form ref="form-el" :model="form" :rules="rules" label-width="auto" label-position="top">
			<el-form-item label="Reagent Name" prop="reagentName">
				<el-input v-model="form.reagentName" placeholder="Enter reagent name" />
			</el-form-item>
			<el-form-item label="Structure" prop="structure">
				<el-input v-model="form.structure" placeholder="Enter structure" />
			</el-form-item>
			<el-form-item label="CAS number" prop="casNumber">
				<el-input v-model="form.casNumber" placeholder="Indicate CAS number" />
			</el-form-item>
			<el-form-item label="Desired Quantity" prop="quantity">
				<el-input-number v-model="form.quantity" :min="1" placeholder="Enter quantity" />
			</el-form-item>
			<el-form-item label="User Comment" prop="userComment">
				<el-input v-model="userComment" type="textarea" placeholder="Enter comment" />
			</el-form-item>
			<div class="btn-container">
				<el-button @click="cancel">Cancel</el-button>
				<el-button type="primary">Create</el-button>
			</div>
		</el-form>
	</div>
</template>

<style scoped>
.el-input-number {
	width: 100%;
}
</style>
