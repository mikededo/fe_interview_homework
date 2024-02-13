<script lang="ts">
	import { isDateWeekend } from '../../utils';

	export let dates: Date[];
</script>

<div class="no-wrap flex h-full w-full">
	<!-- TODO: Virtualize list-->
	{#each dates as date (date)}
		<div class="h-full w-cell shrink-0 border-r" class:bg-plum-5={isDateWeekend(date)} />
	{/each}
</div>
