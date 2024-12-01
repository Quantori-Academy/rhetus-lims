import { format } from 'date-fns';

// We show all dates in this format
const DEFAULT_FORMAT = 'dd-MMM-yyyy';

export const toDefaultFormat = date => format(date, DEFAULT_FORMAT);

export const formatDate = date => {
	if (!date) return '';

	return toDefaultFormat(new Date(date)).toUpperCase();
};

export const convertToCustomDate = originalTimestamp => {
	const date = new Date(originalTimestamp);

	const year = date.getUTCFullYear();
	const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
	const day = date.getUTCDate().toString().padStart(2, '0');

	const hours = date.getUTCHours().toString().padStart(2, '0');
	const minutes = date.getUTCMinutes().toString().padStart(2, '0');

	return `${year}-${month}-${day} ${hours}:${minutes}`;
};
