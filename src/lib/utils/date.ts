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
	nextThirtyDays.setDate(nextThirtyDays.getDate() + 30);

	return (
		date.toDateString() === new Date().toDateString() ||
		(date <= nextThirtyDays && date > new Date())
	);
};

export const isDateWeekend = (current: Date): boolean =>
	current.getDay() === 0 || current.getDay() === 6;
