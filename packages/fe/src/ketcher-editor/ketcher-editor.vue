<script setup>
import { ElPopover, ElButton, ElInput } from 'element-plus';
import { ref } from 'vue';
import { $notifyUserAboutError } from '../lib/utils/feedback/notify-msg';
import RhIcon from '../lib/components/rh-icon.vue';
const isPopoverVisible = ref(false);
const ketcherFrame = ref(null);
const isSearching = ref(false);
const smiles = defineModel('smiles', { type: String });
const buttonRef = ref();

const searchByStructure = async () => {
	let ketcher = ketcherFrame.value.contentWindow.ketcher;
	isSearching.value = true;
	try {
		smiles.value = await ketcher.getSmiles();
	} catch (e) {
		$notifyUserAboutError(e);
	} finally {
		isPopoverVisible.value = !isPopoverVisible.value;
		isSearching.value = false;
	}
};
</script>

<template>
	<el-input v-model="smiles" clearable placeholder="Search structure">
		<template #append>
			<el-button ref="buttonRef" :class="['icon-button', { 'custom-border': isPopoverVisible }]">
				<rh-icon name="diagram" />
			</el-button>
			<el-popover
				v-model:visible="isPopoverVisible"
				:virtual-ref="buttonRef"
				trigger="click"
				:width="600"
				virtual-triggering
			>
				<div class="popover-content">
					<div class="ketcher-container">
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
						<div class="search-btns">
							<el-button
								:loading="isSearching"
								type="primary"
								size="large"
								plain
								@click="searchByStructure"
							>
								Search
							</el-button>
						</div>
					</div>
				</div>
			</el-popover>
		</template>
	</el-input>
</template>

<style scoped>
.ketcher-editor {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 1em;
	height: 90%;
}

.ketcher-container {
	height: 500px;
}

.search-btns {
	display: flex;
	justify-content: center;
}

.icon-button {
	display: flex;
	justify-content: center;
	align-items: center;
}

.el-button.custom-border {
	outline: none;
	border: 1px solid #1785be;
}
</style>
