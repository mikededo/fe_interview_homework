<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	export let textarea = false;
	export let value: string | undefined = undefined;

	const inputClasses = twMerge(
		'rounded-md text-sm border p-2 ring ring-transparent transition-all focus:outline-none focus:ring-2 focus:ring-purple-ui focus:ring-offset-2 focus:ring-offset-white',
		$$restProps.class
	);
</script>

{#if textarea}
	<textarea
		{...$$restProps}
		bind:value
		on:blur
		on:keydown
		on:change
		on:focus
		class={inputClasses}
	/>
{:else}
	<input {...$$restProps} bind:value on:blur on:keydown on:change on:focus class={inputClasses} />
{/if}
