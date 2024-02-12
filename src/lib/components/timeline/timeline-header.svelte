<script>
	import { Menu } from 'lucide-svelte';

	import { toggleSidenav } from '../../stores';
</script>

<div class="h-header-h w-full bg-white p-4">
	<div class="flex items-center gap-2">
		<button
			class="flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-slate-100"
			on:click={toggleSidenav}>
			<Menu class="h-5 w-5" />
		</button>
		<h1 class="text-lg font-semibold">Team name</h1>
	</div>
</div>
