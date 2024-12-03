import { format } from 'date-fns';

// We show all dates in this format
const DEFAULT_FORMAT = 'dd-MMM-yyyy';
const TIMELINE_FORMAT = 'yyyy-MM-dd HH:mm';

export const toDefaultFormat = date => format(date, DEFAULT_FORMAT);

export const formatDate = date => {
	if (!date) return '';

	return toDefaultFormat(new Date(date)).toUpperCase();
};

export const convertToCustomDate = originalTimestamp => {
	if (!originalTimestamp) return '';

	const date = new Date(originalTimestamp);

	return format(date, TIMELINE_FORMAT);
};
