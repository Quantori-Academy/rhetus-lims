import { $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg';
import { $api } from '../../lib/api';

export const fetchSubstances = async (id, form, loading) => {
	loading.value = true;
	try {
		const reagentData = await $api.reagents.fetchReagent(id);
		form.value.reagents.push({
			reagentName: reagentData.name,
			quantityUnit: reagentData.quantityUnit,
			quantity: reagentData.quantity,
			amount: reagentData.amount || 1
		});
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error fetching reagent');
	} finally {
		loading.value = false;
	}
};

export const fetchRequests = async (incomingRequests, loading) => {
	loading.value = true;
	try {
		const data = await $api.requests.fetchRequests();
		incomingRequests.value = {
			...data,
			requests: data.requests.filter(request => request.status === 'pending')
		};
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error retrieving request');
	} finally {
		loading.value = false;
	}
};