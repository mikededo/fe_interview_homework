<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	import { tasksStore } from '../../stores';
	import {
		getDateFromIndex,
		isIndexNextThirtyDays,
		isIndexToday,
		isIndexWeekend,
	} from '../../utils';

	export let index: number;

	const { start } = $tasksStore.dateRange;
	const isToday = isIndexToday(index, start);
	const isPrevToday = isIndexToday(index - 1, start);
	const isNextThirtyDays = !isToday && isIndexNextThirtyDays(index, start);
	const isNextNotThirtyDays =
		isIndexNextThirtyDays(index, start) &&
		!isIndexNextThirtyDays(index + 1, start);
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
		'h-full w-[54px] flex items-center shrink-0 border-b',
		isNextThirtyDays ? 'py-0.5' : 'p-0.5',
		withDivider && 'border-r'
	);
</script>

<div class={containerClasses}>
	<div class={classes}>
		<p
			class="text-sm font-semibold"
			class:text-plum-50={isIndexWeekend(index, start)}
		>
			{getDateFromIndex(index, start)}
		</p>
	</div>
</div>
