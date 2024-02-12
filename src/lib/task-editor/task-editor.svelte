<script lang="ts">
	import { slide } from 'svelte/transition';
	import { sineOut } from 'svelte/easing';

	export let show = false;
</script>

{#if show}
	<div
		class="absolute bottom-0.5 right-0 top-header-h mt-6 box-border w-[480px] rounded-l bg-white shadow-floating transition-all"
		transition:slide={{ axis: 'x', duration: 200, easing: sineOut }}>
	</div>
{/if}
