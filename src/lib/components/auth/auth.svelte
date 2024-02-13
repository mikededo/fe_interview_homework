<script lang="ts">
	import { KeyRound } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	import { LocalStorageKeys } from '../../config';
	import { fetchTasks, loadAuthData, showAuthDialog } from '../../stores';
	import { LocalStorage } from '../../utils';

	// TODO: Refactor into input component
	const inputClasses =
		'rounded-md text-sm border p-2 font-mono ring ring-transparent transition-all focus:outline-none focus:ring-2 focus:ring-purple-ui focus:ring-offset-2 focus:ring-offset-white';
	const InputFields = {
		projectId: 'projectId',
		teamId: 'teamId',
		token: 'token',
	};

	const storedProjectId = LocalStorage.get(LocalStorageKeys.PROJECT_ID) ?? '';
	const storedTeamId = LocalStorage.get(LocalStorageKeys.TEAM_ID) ?? '';
	const storedToken = LocalStorage.get(LocalStorageKeys.JWT) ?? '';

	const handleOnSubmit = (e: SubmitEvent) => {
		const formData = new FormData(e.target as HTMLFormElement);
		const projectId = formData.get(InputFields.projectId) as string;
		const teamId = formData.get(InputFields.teamId) as string;
		const token = formData.get(InputFields.token) as string;

		if (projectId && teamId && token) {
			LocalStorage.set(LocalStorageKeys.PROJECT_ID, projectId);
			LocalStorage.set(LocalStorageKeys.TEAM_ID, teamId);
			LocalStorage.set(LocalStorageKeys.JWT, token);

			loadAuthData();
			// Load the date once the user is authenticated
			fetchTasks();
		}
	};
</script>

{#if $showAuthDialog}
	<div
		role="presentation"
		class="fixed inset-0 bg-black/50"
		transition:fade={{ duration: 150 }}
	/>
	<div
		role="dialog"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
		transition:fade={{ duration: 150 }}
	>
		<div class="max-w-lg rounded bg-white p-8 shadow-lg">
			<h2 class="text-xl font-semibold">Authentication</h2>
			<p class="mb-4 italic">
				Since this demo does not have authentication, I need you to set three
				parameters!
			</p>
			<form
				on:submit|preventDefault={handleOnSubmit}
				class="flex flex-col gap-4"
			>
				<div class="flex flex-col gap-2">
					<label for="projectId" class="text-sm">Project ID</label>
					<input
						class={inputClasses}
						id={InputFields.projectId}
						name={InputFields.projectId}
						placeholder="1234567"
						type="number"
						value={storedProjectId}
						required
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label for="teamId" class="text-sm">Team ID</label>
					<input
						class={inputClasses}
						id={InputFields.teamId}
						name={InputFields.teamId}
						placeholder="1234567"
						type="number"
						value={storedTeamId}
						required
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label for="token" class="text-sm">Token</label>
					<input
						class={inputClasses}
						id={InputFields.token}
						name={InputFields.token}
						placeholder="JWT Authentication token"
						type="text"
						value={storedToken}
						required
					/>
				</div>
				<button
					type="submit"
					class="flex items-center gap-2 self-end rounded bg-purple-ui px-3 py-2 text-sm font-semibold uppercase text-white transition-colors hover:bg-purple-ui-hover focus:bg-purple-ui-on-click active:bg-purple-ui-on-click"
				>
					<KeyRound class="h-4 w-4" />
					<span>Log in</span>
				</button>
			</form>
		</div>
	</div>
{/if}
