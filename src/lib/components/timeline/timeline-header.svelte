<script>
	import { Menu } from 'lucide-svelte';

	import { toggleSidenav } from '../../stores';
	import { IconButton } from '../icon-button';
</script>

<div class="h-header-h w-full bg-white p-4">
	<div class="flex items-center gap-2">
		<IconButton Icon={Menu} on:click={toggleSidenav} />
		<h1 class="text-lg font-semibold">Team name</h1>
	</div>
</div>
