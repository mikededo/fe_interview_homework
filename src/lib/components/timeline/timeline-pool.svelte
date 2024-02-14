<script lang="ts">
	import TimelineTask from './timeline-task.svelte';
	import { CELL_WIDTH, LANE_HEIGHT, POOL_PADDING } from '../../config';
	import { tasksStore } from '../../stores';

	export let dates: Date[];

	$: swimlanes = $tasksStore.swimlanes;
	$: height = swimlanes ? swimlanes.length * LANE_HEIGHT + POOL_PADDING * 2 : 0;
	$: width = dates.length * CELL_WIDTH;
</script>

{#if swimlanes}
	<div
		class="absolute left-0 top-12 overflow-hidden bg-gray-300/25 transition-all"
		style="width: {width}px; height: {height}px"
	>
		{#each swimlanes as swimlane, i (i)}
			{#each swimlane as task (task.id)}
				<TimelineTask {task} lane={i} />
			{/each}
		{/each}
	</div>
{/if}
