<script setup>
import PageWithSidebar from '../../../sidebar/page-with-sidebar.vue';
import { $router } from '../router.js';
import { $notify } from '../../utils/feedback/notify-msg.js';
import { inject } from 'vue';

const { user } = inject('user');

$router.beforeEach((to, from, next) => {
	const { meta } = to;

	if (meta.roles && !meta.roles.includes(user.value?.role?.name)) {
		next({ name: '404' });

		$notify({
			title: 'Error',
			message:
				'You do not have the credentials to access this page. Please consult your administrator',
			type: 'error'
		});
	} else {
		next();
	}
});
</script>

<template>
	<page-with-sidebar>
		<router-view />
	</page-with-sidebar>
</template>
