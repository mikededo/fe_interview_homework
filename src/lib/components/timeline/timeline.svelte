<script lang="ts">
	import { onMount } from 'svelte';

	import TimelineColumnHeader from './timeline-column-header.svelte';
	import TimelineColumn from './timeline-column.svelte';
	import TimelineHeader from './timeline-header.svelte';
	import TimelinePool from './timeline-pool.svelte';
	import { CELL_COUNT, CELL_WIDTH } from '../../config';
	import {
		fetchIncomingDates,
		fetchPreviousDates,
		fetchTasks,
		loadAuthData,
		showAuthDialog,
		tasksStore,
	} from '../../stores';
	import { generateDateRange } from '../../utils';

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

	$: dates = generateDateRange(
		$tasksStore.dateRange.start,
		$tasksStore.dateRange.end
	);

	onMount(() => {
		loadAuthData();
		setTimeout(() => {
			const left =
				(swimlaneScrollable.scrollWidth - swimlaneScrollable.clientWidth) / 2;
			swimlaneScrollable.scrollTo({ left, behavior: 'instant' });
		}, 0);

		fetchTasks().catch(() => {
			showAuthDialog.set(true);
		});

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
		<TimelineColumnHeader {dates} />
		<TimelineColumn {dates} />
		<TimelinePool {dates} />
	</div>
</section>
