<script lang="ts">
	import { X } from 'lucide-svelte';
	import { quadOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	import { taskEditorStore } from '../../stores';
	import { IconButton } from '../icon-button';

	const handleOnClose = () => {
		// TODO: Update task if any changes
		taskEditorStore.set(null);
	};
</script>

{#if $taskEditorStore}
	<!-- TODO: Extract 480px into css variable -->
	<div
		class="transition-alla absolute bottom-0.5 right-0 top-header-h z-50 mt-8 box-border w-[480px] rounded-l bg-white shadow-floating"
		transition:slide={{ axis: 'x', duration: 250, easing: quadOut }}
	>
		<section class="flex w-[480px] min-w-[480px] flex-col gap-4 px-6 py-2">
			<div class="flex flex-row items-center justify-between">
				<span class="text-[10px] text-gray-600">
					Last updated: {new Date($taskEditorStore.updated_at).toLocaleString('en-EN')} | Created by
					{$taskEditorStore.created_by}
				</span>

				<IconButton Icon={X} on:click={handleOnClose} />
			</div>
			<textarea
				class="h-6 w-full resize-none overflow-hidden border-none text-xl font-semibold outline-none"
				tabindex="0"
				rows="1"
				placeholder="Enter the task name..."
				value={$taskEditorStore.name}
			/>
		</section>
	</div>
{/if}
