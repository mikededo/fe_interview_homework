<script lang="ts">
	import { Send, X } from 'lucide-svelte';
	import { quadOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	import TaskEditorComments from './task-editor-comments.svelte';
	import { taskEditorStore, updateTask } from '../../stores';
	import { IconButton } from '../icon-button';
	import { Input } from '../input';

	let commentValue: string;

	const handleOnClose = () => {
		taskEditorStore.set(null);
	};

	const handleOnAddComment = () => {
		if (commentValue && $taskEditorStore) {
			const task = $taskEditorStore;
			task.comments = [...task.comments, commentValue];

			commentValue = '';
			$taskEditorStore = task;
			updateTask(task);
		}
	};

	const handleOnCommentKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			handleOnAddComment();
		}
	};
</script>

{#if $taskEditorStore}
	<div
		class="absolute bottom-0.5 right-0 top-header-h z-50 mt-8 box-border w-editor-w rounded-l bg-white shadow-floating transition-all"
		transition:slide={{ axis: 'x', duration: 250, easing: quadOut }}
	>
		<div class="flex w-editor-w min-w-editor-w flex-row items-center justify-between px-6 pt-2">
			<span class="text-[10px] text-gray-600">
				Last updated: {new Date($taskEditorStore.updated_at).toLocaleString('en-EN')} | Created by
				{$taskEditorStore.created_by}
			</span>

			<IconButton Icon={X} on:click={handleOnClose} />
		</div>

		<section
			class="flex h-[calc(100%_-_82px)] w-editor-w min-w-editor-w flex-col gap-4 overflow-y-auto px-6 py-2"
		>
			<textarea
				class="h-6 w-full shrink-0 resize-none overflow-hidden border-none text-xl font-semibold outline-none"
				tabindex="0"
				rows="1"
				placeholder="Enter the task name..."
				value={$taskEditorStore.name}
			/>

			<div class="flex w-full flex-col gap-1">
				<label for="description" class="text-[10px] uppercase text-gray-600">Description</label>
				<!-- Notes are not provided when short is passed and they are  given in a specific format that I'm not aware of the specification -->
				<!-- Therefore, notes will be added manually-->
				<Input
					id="description"
					name="description"
					rows="1"
					placeholder="Enter the task description..."
					textarea
				/>
			</div>
			<div class="flex flex-1 flex-col justify-end">
				<TaskEditorComments />
			</div>
		</section>
		<div class="absolute bottom-2 left-6 right-6 flex flex-col justify-end gap-1 self-end pb-2">
			<div class="flex items-center gap-2">
				<Input
					bind:value={commentValue}
					class="w-full"
					placeholder="Enter the task description..."
					on:keydown={handleOnCommentKeyDown}
				/>
				<IconButton
					Icon={Send}
					class="shrink-0 bg-purple-ui text-white hover:bg-purple-ui-hover disabled:bg-plum-30"
					disabled={!commentValue}
					on:click={handleOnAddComment}
				/>
			</div>
		</div>
	</div>
{/if}
