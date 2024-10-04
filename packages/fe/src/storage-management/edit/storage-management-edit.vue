<script setup>
import { ref, onMounted } from "vue"
import { ElForm, ElInput, ElButton, ElFormItem } from 'element-plus';

import { $api } from "../../lib/api";
import { $confirm } from '../../lib/utils/feedback/confirm-msg';
import { $notify, $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg.js';
import { router } from "../../lib/router/router";

const storage = ref(null);
const isLoading = ref(false);

const props = defineProps({
    id: {
        type: String,
        default: null
    }
})

const validator = ref({
    room: [{ required: true, message: "Room can't be empty" }],
    name: [{ required: true, message: "Name can't be empty" }]
})
async function setStorage(id) {
    isLoading.value = true;
	try {
		storage.value = await $api.storages.fetchStorage(id);
		console.log(storage.value);
	} catch (error) {
		$notifyUserAboutError(error);
	}

	isLoading.value = false;
}

function cancelEdit() {
    console.log("cancel edit")
}

async function handleSubmit() {
    try {
        const updatedStorage = await $api.storages.updateStorage(storage.value.id, storage.value);
        $notify({
			title: 'Success',
			message: 'Storage has been updated',
			type: 'success'
		});
        router.push({ name: 'storages-list' });
    } catch(error) {
        $notifyUserAboutError(error.message || 'Error updating storage');
    }
}

onMounted(() => {
	setStorage(props.id);
});
</script>

<template>
    <div class="wrapper">
        <h1>Storage Location Edit</h1>
        <el-form
            v-if="storage && !loading"
            ref="form-ref"
            label-position="top"
            :model="storage"
            :rules="validator"
            @submit="handleSubmit"
        >
            <el-form-item label="Room" prop="room">
                <el-input v-model="storage.room"></el-input>
            </el-form-item>
            <el-form-item label="Name" prop="name">
                <el-input v-model="storage.name"></el-input>
            </el-form-item>
            <el-button @click="cancelEdit">Cancel</el-button>
		    <el-button type="primary" @click="handleSubmit">Save</el-button>
        </el-form>
    </div>
</template>

