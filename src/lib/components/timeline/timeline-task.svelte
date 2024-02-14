<script lang="ts">
	import { onMount } from 'svelte';

	import { CELL_WIDTH, LANE_HEIGHT, POOL_PADDING, TASK_MARGIN } from '../../config';
	import { taskEditorStore, tasksStore, updateTask } from '../../stores';
	import type { Task } from '../../types';
	import { getDaysBetweenDates } from '../../utils';

	export let task: Task;
	export let lane: number;

	let isResizing = false;
	let isDragging = false;
	let draggedDistance = { initial: 0, dragged: 0 };
	let isLeftEdge = false;
	let isRightEdge = false;

	const handleOnMouseMove = (event: MouseEvent) => {
		if (isResizing || isDragging) {
			draggedDistance = {
				...draggedDistance,
				dragged: Math.floor((event.clientX - draggedDistance.initial) / CELL_WIDTH),
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
		isDragging = !isResizing;
		draggedDistance.initial = e.clientX;
	};

	const handleOnMouseUp = () => {
		if (!isResizing && !isDragging) {
			return;
		}

		const newStartDate = new Date(task.start_date);
		const newEndDate = new Date(task.end_date);

		if (isDragging) {
			// Update both ends
			newStartDate.setDate(newStartDate.getDate() + draggedDistance.dragged);
			newEndDate.setDate(newEndDate.getDate() + draggedDistance.dragged);
		} else if (isLeftEdge) {
			newStartDate.setDate(newStartDate.getDate() + draggedDistance.dragged);
		} else if (isRightEdge) {
			newEndDate.setDate(newEndDate.getDate() + draggedDistance.dragged);
		}

		// Update the task dates in YYYY-MM-DD format
		task.start_date = newStartDate.toISOString().split('T')[0];
		task.end_date = newEndDate.toISOString().split('T')[0];
		updateTask(task);

		isResizing = false;
		isDragging = false;
		draggedDistance = { initial: 0, dragged: 0 };
	};

	const handleOnClick = () => {
		taskEditorStore.set(task);
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
	$: datesDiff = getDaysBetweenDates(startDate, endDate);
	$: startDiff = getDaysBetweenDates(today, startDate);
	$: start = startDiff - $tasksStore.dateRange.start;

	$: sizeChange = draggedDistance.dragged * CELL_WIDTH;
	$: increaseLeft = isLeftEdge ? sizeChange : 0;
	// If is moving the left edge, when need to keep the right edge in place
	$: increaseRight = isRightEdge ? sizeChange : sizeChange * -1;

	$: left =
		(start + (isDragging ? draggedDistance.dragged : 0)) * CELL_WIDTH +
		(!isDragging ? increaseLeft : 0);
	// Adding one as the range is inclusive
	$: width = (datesDiff + 1) * CELL_WIDTH - TASK_MARGIN * 2 + (!isDragging ? increaseRight : 0);
	$: top = POOL_PADDING + lane * LANE_HEIGHT;
</script>

<style>
	.transitions {
		transition-property: width, box-shadow;
		transition-duration: 50ms, 250ms;
	}
</style>

<div
	role="presentation"
	class="transitions absolute ml-0.5 h-task-h rounded-sm bg-purple-ui px-2 py-1.5 transition-all ease-in-out hover:shadow-md hover:shadow-purple-60"
	class:hover:cursor-pointer={!isDragging && !isLeftEdge && !isRightEdge}
	class:cursor-grab={isDragging}
	class:cursor-ew-resize={isLeftEdge || isRightEdge}
	class:drop-shadow-xl={isResizing}
	style="left: {left}px; width: {width}px; top: {top}px"
	on:mousemove={handleOnMouseMove}
	on:mousedown={handleOnMouseDown}
	on:click={handleOnClick}
>
	<div class:pointer-events-none={isResizing}>
		<p class="text-sm font-semibold text-white">
			{task.name}
		</p>
		<p class="text-xs text-white/60">{task.name}</p>
	</div>
</div>
