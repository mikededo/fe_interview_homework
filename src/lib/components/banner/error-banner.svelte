<script lang="ts">
	import { X } from 'lucide-svelte';
	import { quartIn } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	import { clearError, errorStore } from '../../stores';
	import { IconButton } from '../icon-button';
</script>

{#if $errorStore.exists}
	<!--Crate a fixed bottom banner component-->
	<div
		class="fixed bottom-0 left-sidenav-w right-0 flex h-14 items-center justify-between border-t border-t-error bg-error-20 px-4 py-2 text-error"
		transition:slide={{ duration: 250, easing: quartIn }}
	>
		<p class="text-sm">{$errorStore.message}</p>
		<IconButton
			Icon={X}
			on:click={clearError}
			class="hover:bg-error-20-hover focus:bg-error-20-on-click"
		/>
	</div>
{/if}
