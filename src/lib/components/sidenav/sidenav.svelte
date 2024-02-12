<script lang="ts">
	import { HelpCircle, Moon, Settings } from 'lucide-svelte';
	import { cubicInOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	import { isSidenavHidden } from '../../stores';
</script>

<!-- This is just mock up data :) -->
<nav class="no-wrap flex h-screen w-sidenav-w flex-row">
	<section
		class="no-shrink flex h-full w-12 min-w-12 flex-col items-center gap-4 bg-plum-135 py-4"
	>
		<a href="https://plan.toggl.com/">
			<Moon class="h-5 w-5 stroke-plum-50" />
		</a>
		<Settings class="mt-auto h-5 w-5 stroke-plum-50" />
		<HelpCircle class="h-5 w-5 stroke-plum-50" />
	</section>
	{#if $isSidenavHidden}
		<section
			class="h-full w-full bg-plum-95 transition-all"
			transition:slide={{ axis: 'x', easing: cubicInOut, duration: 250 }}
		>
			<div class="px-4 py-3">
				<span class="monospace text-lg text-white">miquel@toggl.com</span>
			</div>
		</section>
	{/if}
</nav>
