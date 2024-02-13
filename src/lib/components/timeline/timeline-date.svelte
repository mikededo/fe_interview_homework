<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	import {
		getDateHeaderText,
		getNextDay,
		getPreviousDay,
		isDateNextThirtyDays,
		isDateToday,
		isDateWeekend,
	} from '../../utils';

	export let date: Date;

	const prev = getPreviousDay(date);
	const next = getNextDay(date);

	const isToday = isDateToday(date);
	const isPrevToday = isDateToday(prev);
	const isNextThirtyDays = !isToday && isDateNextThirtyDays(date);
	const isNextNotThirtyDays = isNextThirtyDays && !isDateNextThirtyDays(next);
	const isWeekend = isDateWeekend(date);
	const withDivider =
		!isToday && !isPrevToday && !isNextThirtyDays && !isNextNotThirtyDays;

	const classes = twMerge(
		'flex h-full w-full items-center justify-center',
		isToday && 'bg-purple-ui text-white rounded-md',
		isNextThirtyDays && 'bg-purple-30',
		isPrevToday && 'rounded-l',
		isNextNotThirtyDays && 'rounded-r'
	);
	const containerClasses = twMerge(
		'h-full w-cell flex items-center shrink-0 border-b',
		isNextThirtyDays ? 'py-0.5' : 'p-0.5',
		withDivider && 'border-r'
	);
</script>

<div class={containerClasses}>
	<div class={classes}>
		<p class="text-sm font-semibold" class:text-plum-50={isWeekend}>
			{getDateHeaderText(date)}
		</p>
	</div>
</div>
