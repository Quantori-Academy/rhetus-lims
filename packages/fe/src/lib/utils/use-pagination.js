import { ref, watchEffect } from 'vue';
import { $notifyUserAboutError } from './feedback/notify-msg.js';

export function usePagination(apiFetchFunction, initialLimit = 5) {
	const currentPage = ref(1);
	const currentLimit = ref(initialLimit);
	const totalItemsLength = ref(0);
	const paginatedItems = ref([]);
	const isLoading = ref(false);
	let currentEndpoint = '';

	const fetchItems = async () => {
		if (!currentEndpoint) return;
		isLoading.value = true;
		try {
			const params = { page: currentPage.value, limit: currentLimit.value };
			const queryString = new URLSearchParams(params).toString();
			const response = await apiFetchFunction(`${currentEndpoint}?${queryString}`);
			paginatedItems.value = response.items;
			totalItemsLength.value = response.total;
		} catch (error) {
			$notifyUserAboutError(error);
		} finally {
			isLoading.value = false;
		}
	};

	const updatePage = newPage => {
		currentPage.value = newPage;
		fetchItems();
	};

	const updateLimit = newLimit => {
		currentLimit.value = newLimit;
		currentPage.value = 1;
		fetchItems();
	};

	const setEndpoint = endpoint => {
		currentEndpoint = endpoint;
		fetchItems();
	};

	watchEffect(() => {
		fetchItems();
	});

	return {
		currentPage,
		currentLimit,
		totalItemsLength,
		paginatedItems,
		isLoading,
		updatePage,
		updateLimit,
		setEndpoint
	};
}
