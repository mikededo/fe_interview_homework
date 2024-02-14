<script lang="ts">
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';

	import { CELL_WIDTH, LANE_HEIGHT, POOL_PADDING, TASK_MARGIN } from '../../config';
	import { taskEditorStore, tasksStore, updateTask } from '../../stores';
	import type { Task } from '../../types';
	import { getDaysBetweenDates } from '../../utils';

	export let task: Task;
	export let lane: number;

	let taskElement: HTMLDivElement;
	let isResizing = false;
	let isDragging = false;
	let draggedDistance = { initial: 0, dragged: 0 };
	let isLeftEdge = false;
	let isRightEdge = false;

	// Since we are using document events, we need to ensure that the events are coming from
	// the current element or one of its children
	const isCurrentElement = (event: Event) =>
		event.target === taskElement || taskElement.contains(event.target as Node);

	const handleOnMouseMove = (event: MouseEvent) => {
		if (isResizing || isDragging) {
			// console.log(event.clientX, draggedDistance.initial, draggedDistance.dragged);
			draggedDistance = {
				...draggedDistance,
				dragged: Math.floor((event.clientX - draggedDistance.initial) / CELL_WIDTH),
			};
			event.preventDefault();

			return;
		}

		if (!isCurrentElement(event)) {
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

	const handleOnMouseDown = (event: MouseEvent) => {
		if (!isCurrentElement(event)) {
			return;
		}

		isResizing = isLeftEdge || isRightEdge;
		isDragging = !isResizing;
		draggedDistance.initial = event.clientX;
	};

	const handleOnMouseUp = (event: MouseEvent) => {
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

		// If the mouse up is over the task, we need to reset the state
		if (!isCurrentElement(event)) {
			isResizing = false;
			isDragging = false;
			draggedDistance = { initial: 0, dragged: 0 };
		}
	};

	const handleOnClick = (event: MouseEvent) => {
		if (!isCurrentElement(event)) {
			return;
		}

		// As specified in mdn docs https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event,
		// the click event occurs after the mouseup. This means that by resetting the state in mouseup, by the
		// time the click handler executes, it will not know if it was dragging or resizing, meaning that it
		// would open the drawer (not a valid use casee)
		if (isResizing || isDragging) {
			isResizing = false;
			isDragging = false;
			draggedDistance = { initial: 0, dragged: 0 };
			return;
		}

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

	const getTaskEstimatedMinutes = () => {
		const minutes = task.daily_estimated_minutes;
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
</script>

<style>
	.transitions {
		transition-property: width, box-shadow;
		transition-duration: 50ms, 250ms;
	}
</style>

<div
	bind:this={taskElement}
	role="presentation"
	class="transitions absolute ml-0.5 h-task-h overflow-hidden rounded-sm bg-purple-ui px-2 py-1.5 transition-shadow ease-in-out hover:shadow-md hover:shadow-purple-60"
	class:hover:cursor-pointer={!isDragging && !isLeftEdge && !isRightEdge}
	class:cursor-grab={isDragging}
	class:cursor-ew-resize={isLeftEdge || isRightEdge}
	class:drop-shadow-xl={isResizing}
	class:z-50={isDragging || isResizing}
	style="left: {left}px; width: {width}px; top: {top}px"
	on:mousemove={handleOnMouseMove}
	on:mousedown={handleOnMouseDown}
	on:click={handleOnClick}
	transition:scale={{ duration: isDragging || isResizing ? 0 : 250 }}
>
	<div class:pointer-events-none={isResizing}>
		<p class="text-sm font-semibold text-white">
			{width} | {draggedDistance.dragged} | {isDragging} | {isResizing}
		</p>
		<div class="flex items-center justify-between">
			<p class="line-clamp-1 text-xs text-white/60">{task.name}</p>
			<p class="line-clamp-1 text-xs font-semibold text-white">{getTaskEstimatedMinutes()} daily</p>
		</div>
	</div>
</div>
