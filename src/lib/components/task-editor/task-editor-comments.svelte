<script>
	import { User } from 'lucide-svelte';
	import { quadOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	import { taskEditorStore } from '../../stores';
</script>

{#if $taskEditorStore}
	<p class="text-[10px] uppercase text-gray-600">Comments</p>
	{#if $taskEditorStore.comments.length > 0}
		<div class="my-4 w-full">
			{#each $taskEditorStore.comments as comment}
				<div class="flex flex-col gap-2" transition:slide={{ duration: 150, easing: quadOut }}>
					<div class="flex items-center gap-2">
						<div class="h-5 w-5 rounded-full border p-0.5">
							<User class="h-full w-full stroke-purple-ui" />
						</div>
						<span class="text-sm font-semibold">Someone</span>
					</div>
					<p class="ml-7 text-sm">{comment}</p>
				</div>
			{/each}
		</div>
	{/if}
{/if}
