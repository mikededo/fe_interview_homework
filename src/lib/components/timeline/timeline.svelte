<script lang="ts">
	import { onMount } from 'svelte';

	// TODO: Refactor this logic

	import TimelineDate from './timeline-date.svelte';
	import TimelineHeader from './timeline-header.svelte';
	import {
		authStore,
		fetchTasks,
		loadAuthData,
		tasksStore,
	} from '../../stores';
	import { isIndexWeekend } from '../../utils';

	let swimlaneScrollable: HTMLDivElement;

	const length = $tasksStore.dateRange.end - $tasksStore.dateRange.start;

	onMount(async () => {
		loadAuthData();
		if (!$authStore) {
			return;
		}

		fetchTasks($authStore).then(() => {
			setTimeout(() => {
				swimlaneScrollable.scrollLeft =
					(swimlaneScrollable.scrollWidth - swimlaneScrollable.clientWidth) / 2;
			}, 0);
		});
	});
</script>

<section class="relative min-h-screen w-full overflow-hidden">
	<!-- TODO: Extract variable into tailwind config -->
	<TimelineHeader />
	<div
		bind:this={swimlaneScrollable}
		class="flex h-[calc(100%_-_var(--header-height))] w-full flex-col overflow-auto
		bg-background"
	>
		{#if $tasksStore.tasks}
			<div class="no-wrap flex h-8 w-full transition-all">
				{#each { length } as _, i}
					<TimelineDate index={i} />
				{/each}
			</div>

			<div class="no-wrap flex h-full w-full">
				{#each { length } as _, i}
					<div
						class="h-full w-[54px] shrink-0 border-r"
						class:bg-plum-5={isIndexWeekend(i, $tasksStore.dateRange.start)}
					/>
				{/each}
			</div>
		{:else if $tasksStore.error}
			<!-- TODO: Add error styling -->
			<div>An error ocurred</div>
		{/if}
	</div>
</section>
