<script lang="ts">
	import { onMount } from 'svelte';

	import {
		CELL_WIDTH,
		LANE_HEIGHT,
		POOL_PADDING,
		TASK_MARGIN,
	} from '../../config';
	import { tasksStore, updateTask } from '../../stores';
	import type { Task } from '../../types';
	import { getDaysBetweenDates } from '../../utils';

	export let task: Task;
	export let lane: number;

	let isResizing = false;
	let draggedDistance = { initial: 0, dragged: 0 };
	let isLeftEdge = false;
	let isRightEdge = false;

	const handleOnMouseMove = (event: MouseEvent) => {
		if (isResizing) {
			draggedDistance = {
				...draggedDistance,
				dragged: Math.floor(
					(event.clientX - draggedDistance.initial) / CELL_WIDTH
				),
			};
			event.preventDefault();

			return;
		}

		const clientX = event.clientX;
		const target = event.target as HTMLElement;
		const { left, width } = target.getBoundingClientRect();

		// Check if the mouse is over the left edge
		isLeftEdge = clientX - left < 5;
		// Check if the mouse is over the right edge
		isRightEdge = left + width - clientX < 5;
	};

	const handleOnMouseDown = (e: MouseEvent) => {
		isResizing = isLeftEdge || isRightEdge;
		draggedDistance.initial = e.clientX;
	};

	const handleOnMouseUp = () => {
		if (isResizing) {
			isResizing = false;
			const newStartDate = new Date(task.start_date);
			const newEndDate = new Date(task.end_date);

			if (isLeftEdge) {
				newStartDate.setDate(newStartDate.getDate() + draggedDistance.dragged);
			} else {
				newEndDate.setDate(newEndDate.getDate() + draggedDistance.dragged);
			}

			// Update the task dates in YYYY-MM-DD format
			task.start_date = newStartDate.toISOString().split('T')[0];
			task.end_date = newEndDate.toISOString().split('T')[0];
			updateTask(task);
			draggedDistance = { initial: 0, dragged: 0 };
		}
	};

	onMount(() => {
		document.addEventListener('mousemove', handleOnMouseMove);
		document.addEventListener('mouseup', handleOnMouseUp);

		return () => {
			document.removeEventListener('mousemove', handleOnMouseMove);
			document.removeEventListener('mouseup', handleOnMouseUp);
		};
	});

	const today = new Date();
	$: startDate = new Date(task.start_date);
	$: endDate = new Date(task.end_date);
	$: startDiff = getDaysBetweenDates(today, startDate);
	$: start = startDiff - $tasksStore.dateRange.start;

	$: sizeChange = draggedDistance.dragged * CELL_WIDTH;
	$: left = start * CELL_WIDTH + (isLeftEdge ? sizeChange : 0);
	// Adding one as the range is inclusive
	$: width =
		(getDaysBetweenDates(startDate, endDate) + 1) * CELL_WIDTH -
		TASK_MARGIN * 2 +
		// If is moving the left edge, when need to keep the right edge in place
		(isRightEdge ? sizeChange : sizeChange * -1);
	$: top = POOL_PADDING + lane * LANE_HEIGHT;
</script>

<div
	role="presentation"
	class="absolute ml-0.5 h-task-h rounded-sm bg-purple-ui px-2 py-1.5 transition-all duration-[50ms] ease-in-out"
	class:cursor-ew-resize={isLeftEdge || isRightEdge}
	class:drop-shadow-xl={isResizing}
	style="left: {left}px; width: {width}px; top: {top}px"
	on:mousemove={handleOnMouseMove}
	on:mousedown={handleOnMouseDown}
>
	<div class:pointer-events-none={isResizing}>
		<p class="text-sm font-semibold text-white">
			{task.name}
		</p>
		<p class="text-xs text-white/60">{task.name}</p>
	</div>
</div>
