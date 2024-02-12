<script lang="ts">
	import { Moon, Settings, HelpCircle } from 'lucide-svelte';
</script>

<!-- This is just mock up data :) -->

<nav class="no-wrap flex h-screen w-64 flex-row">
	<section
		class="flex h-full w-12 flex-col items-center gap-4 bg-plum-135 py-4">
		<a href="https://plan.toggl.com/">
			<Moon class="h-5 w-5 stroke-plum-50" />
		</a>
		<Settings class="mt-auto h-5 w-5 stroke-plum-50" />
		<HelpCircle class="h-5 w-5 stroke-plum-50" />
	</section>
	<section class="h-full w-full bg-plum-95 px-4 py-3">
		<span class="monospace text-lg text-white">miquel@toggl.com</span>
	</section>
</nav>
