<script lang="ts">
	import { onMount } from 'svelte';

	import TimelineHeader from './timeline-header.svelte';
	import { LocalStorageKeys } from '../../config';
	import type { Task } from '../../types';
	import { LocalStorage } from '../../utils';

	let swimlaneScrollable: HTMLDivElement;
	let tasks: Task[];
	let error: unknown;
	let prevCount = -15;
	let nextCount = 15;

	onMount(async () => {
		// When component has been mounted to the DOM, we are already in the browser
		const projectId = LocalStorage.get(LocalStorageKeys.PROJECT_ID);
		const teamId = LocalStorage.get(LocalStorageKeys.TEAM_ID);
		const token = LocalStorage.get(LocalStorageKeys.JWT);

		// TODO: If by any chance one of the values is not set
		if (!projectId || !teamId || !token) {
			return;
		}

		const prevFifteen = new Date();
		prevFifteen.setDate(prevFifteen.getDate() + prevCount);
		const nextFifteen = new Date();
		nextFifteen.setDate(nextFifteen.getDate() + nextCount);

		const since = prevFifteen.toJSON().slice(0, 10);
		const until = nextFifteen.toJSON().slice(0, 10);
		const url = `https://api.plan.toggl.space/api/v6-rc1/${projectId}/tasks?since=${since}&until=${until}&short=true&team=${teamId}`;

		try {
			tasks = await (
				await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
			).json();
		} catch (e) {
			error = e;
		}

		setTimeout(() => {
			swimlaneScrollable.scrollLeft =
				(swimlaneScrollable.scrollWidth - swimlaneScrollable.clientWidth) / 2;
		}, 0);
	});
</script>

<section class="relative min-h-screen w-full overflow-hidden">
	<!-- TODO: Extract variable into tailwind config -->
	<TimelineHeader />
	<div
		bind:this={swimlaneScrollable}
		class="flex h-[calc(100%_-_var(--header-height))] w-full flex-col overflow-auto
		bg-background">
		{#if tasks}
			<div class="no-wrap flex h-6 w-full divide-x transition-all">
				{#each { length: nextCount - prevCount } as _}
					<div class="h-full w-[54px] shrink-0 border-b" />
				{/each}
			</div>

			<div class="no-wrap flex h-full w-full">
				{#each { length: nextCount - prevCount } as _}
					<div class="h-full w-[54px] shrink-0 odd:bg-plum-5" />
				{/each}
			</div>
		{:else if error}
			<!-- TODO: Add error styling -->
			<div>An error ocurred</div>
		{/if}
	</div>
</section>
