export const getDateFromIndex = (index: number, start: number): string => {
	const current = new Date();
	current.setDate(current.getDate() + start + index);
	const weekday = current.toLocaleString('default', { weekday: 'long' });

	return `${weekday[0]} ${current.getDate()}`;
};

export const isIndexToday = (index: number, start: number): boolean => {
	const current = new Date();
	current.setDate(current.getDate() + start + index);
	return current.toDateString() === new Date().toDateString();
};

export const isIndexNextThirtyDays = (
	index: number,
	start: number
): boolean => {
	const current = new Date();
	current.setDate(current.getDate() + start + index);
	const nextThirtyDays = new Date();
	nextThirtyDays.setDate(nextThirtyDays.getDate() + 30);

	return (
		current.toDateString() === new Date().toDateString() ||
		(current <= nextThirtyDays && current > new Date())
	);
};

export const isIndexWeekend = (index: number, start: number): boolean => {
	const current = new Date();
	current.setDate(current.getDate() + start + index);
	return current.getDay() === 0 || current.getDay() === 6;
};
