<script lang="ts">
	import type { Icon as LucideIcon } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	export let Icon: ComponentType<LucideIcon>;

	$: buttonClasses = twMerge(
		'flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-slate-100',
		$$restProps.class
	);
</script>

<button {...$$restProps} class={buttonClasses} on:click>
	<svelte:component this={Icon} class="h-5 w-5" />
</button>
