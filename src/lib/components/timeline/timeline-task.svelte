<script lang="ts">
	import {
		CELL_WIDTH,
		LANE_HEIGHT,
		POOL_PADDING,
		TASK_MARGIN,
	} from '../../config';
	import { tasksStore } from '../../stores';
	import type { Task } from '../../types';
	import { getDaysBetweenDates } from '../../utils';

	export let task: Task;
	export let lane: number;

	const today = new Date();
	const startDate = new Date(task.start_date);
	const endDate = new Date(task.end_date);
	const startDiff = getDaysBetweenDates(today, startDate);
	const start = startDiff - $tasksStore.dateRange.start;

	// TODO: Extract hardcoded number into constant
	const left = start * CELL_WIDTH;
	// Adding one as the range is inclusive
	const width =
		(getDaysBetweenDates(startDate, endDate) + 1) * CELL_WIDTH -
		TASK_MARGIN * 2;
	const top = POOL_PADDING + lane * LANE_HEIGHT;
</script>

<div
	class="absolute ml-0.5 h-task-h rounded-sm bg-purple-ui px-2 py-1.5"
	style="left: {left}px; width: {width}px; top: {top}px"
>
	<p class="text-sm font-semibold text-white">{task.name}</p>
	<p class="text-xs text-white/60">{task.name}</p>
</div>
