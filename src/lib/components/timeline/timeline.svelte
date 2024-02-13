<script lang="ts">
	import { onMount } from 'svelte';

	import TimelineDate from './timeline-date.svelte';
	import TimelineHeader from './timeline-header.svelte';
	import TimelineTask from './timeline-task.svelte';
	import { CELL_COUNT, CELL_WIDTH } from '../../config';
	import {
		fetchIncomingDates,
		fetchPreviousDates,
		fetchTasks,
		loadAuthData,
		tasksStore,
	} from '../../stores';
	import { generateDateRange, isDateWeekend } from '../../utils';

	let swimlaneScrollable: HTMLDivElement;
	const onSwimlaneScroll = (e: Event) => {
		if (!e || !e.target) {
			return;
		}

		const target = e.target as HTMLDivElement;
		if (target.scrollLeft === target.scrollWidth - target.clientWidth) {
			fetchIncomingDates();
		} else if (target.scrollLeft === 0) {
			fetchPreviousDates().then(() => {
				// Make sure the scroll position is persisted so the user does not lose sight
				// This is only required for rthe left scroll
				target.scrollLeft = CELL_WIDTH * CELL_COUNT;
			});
		}
	};

	$: tasks = $tasksStore.tasks;
	$: dates = generateDateRange(
		$tasksStore.dateRange.start,
		$tasksStore.dateRange.end
	);

	onMount(() => {
		loadAuthData();
		setTimeout(() => {
			const left =
				(swimlaneScrollable.scrollWidth - swimlaneScrollable.clientWidth) / 2;
			swimlaneScrollable.scrollTo({ left, behavior: 'smooth' });
		}, 0);

		fetchTasks();

		swimlaneScrollable.addEventListener('scroll', onSwimlaneScroll);

		return () => {
			swimlaneScrollable.removeEventListener('scroll', onSwimlaneScroll);
		};
	});
</script>

<section class="relative min-h-screen w-full overflow-hidden">
	<!-- TODO: Extract variable into tailwind config -->
	<TimelineHeader />
	<div
		bind:this={swimlaneScrollable}
		class="relative flex h-[calc(100%_-_var(--header-height))] w-full flex-col
		overflow-auto bg-background"
	>
		<div class="no-wrap flex h-8 w-full transition-all">
			<!-- TODO: Virtualize list-->
			{#each dates as date (date)}
				<TimelineDate {date} />
			{/each}
		</div>

		<div class="no-wrap flex h-full w-full">
			<!-- TODO: Virtualize list-->
			{#each dates as date (date)}
				<div
					class="h-full w-cell shrink-0 border-r"
					class:bg-plum-5={isDateWeekend(date)}
				/>
			{/each}
		</div>

		<div
			class="absolute bottom-4 left-0 top-12 overflow-hidden"
			style="width: {dates.length * CELL_WIDTH}px"
		>
			{#if tasks}
				{#each tasks as task (task.id)}
					<TimelineTask {task} />
				{/each}
			{/if}
		</div>
	</div>
</section>
