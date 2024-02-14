import { CELL_COUNT } from '../config';

export const generateDateRange = (start: number, end: number): Date[] =>
	Array.from({ length: end - start + 1 }, (_, index) => {
		const current = new Date();
		current.setDate(current.getDate() + start + index);
		return current;
	});

export const getDateHeaderText = (date: Date): string => {
	const weekday = date.toLocaleString('default', { weekday: 'long' });

	return `${weekday[0]} ${date.getDate()}`;
};

export const getPreviousDay = (date: Date): Date => {
	const previousDay = new Date(date);
	previousDay.setDate(previousDay.getDate() - 1);
	return previousDay;
};

export const getNextDay = (date: Date): Date => {
	const nextDay = new Date(date);
	nextDay.setDate(nextDay.getDate() + 1);
	return nextDay;
};

export const isDateToday = (date: Date): boolean =>
	date.toDateString() === new Date().toDateString();

export const isDateNextThirtyDays = (date: Date): boolean => {
	const nextThirtyDays = new Date();
	nextThirtyDays.setDate(nextThirtyDays.getDate() + CELL_COUNT);

	return (
		date.toDateString() === new Date().toDateString() ||
		(date <= nextThirtyDays && date > new Date())
	);
};

export const isDateWeekend = (current: Date): boolean =>
	current.getDay() === 0 || current.getDay() === 6;

export const getDaysBetweenDates = (startDate: Date, endDate: Date): number => {
	// Reomve the hours to avoid partial days
	const start = new Date(startDate);
	start.setHours(0, 0, 0, 0);
	const end = new Date(endDate);
	end.setHours(0, 0, 0, 0);

	return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

export const doDateRangesOverlap = (a: [Date, Date], b: [Date, Date]) => {
	const aStart = a[0].getTime();
	const aEnd = a[1].getTime();
	const bStart = b[0].getTime();
	const bEnd = b[1].getTime();

	return (aStart < bEnd && aEnd > bStart) || (bStart < aEnd && bEnd > aStart);
};

export const getDurationFromMinutes = (minutes: number) => {
	const days = Math.floor(minutes / 60 / 24);
	const hours = Math.floor((minutes / 60) % 24);
	const remainingMinutes = minutes % 60;
	return [
		days > 0 ? `${days}d` : '',
		hours > 0 ? `${hours}h` : '',
		remainingMinutes > 0 ? `${remainingMinutes}m` : '',
	]
		.filter(Boolean)
		.join(' ');
};
