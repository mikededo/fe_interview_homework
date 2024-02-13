<script lang="ts">
	import TimelineDate from './timeline-date.svelte';

	export let dates: Date[];
</script>

<div class="no-wrap flex h-8 w-full transition-all">
	<!-- TODO: Virtualize list-->
	{#each dates as date (date)}
		<TimelineDate {date} />
	{/each}
</div>
