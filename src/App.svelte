<script>
	import { Auth, ErrorBanner, Sidenav, TaskEditor, Timeline } from './lib';
</script>

<main class="flex h-screen w-screen">
	<Sidenav />
	<Timeline />
	<TaskEditor />
	<Auth />
	<ErrorBanner />
</main>
