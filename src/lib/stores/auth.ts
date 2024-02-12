import { writable } from 'svelte/store';

import { LocalStorageKeys } from '../config';
import { LocalStorage } from '../utils';

type AuthData = {
	projectId: string;
	teamId: string;
	token: string;
};
export const authStore = writable<AuthData | null>(null);
export const showAuthPopup = writable(false);

export const loadAuthData = () => {
	const projectId = LocalStorage.get(LocalStorageKeys.PROJECT_ID);
	const teamId = LocalStorage.get(LocalStorageKeys.TEAM_ID);
	const token = LocalStorage.get(LocalStorageKeys.JWT);

	// TODO: If by any chance one of the values is not set
	if (!projectId || !teamId || !token) {
		authStore.set(null);
		showAuthPopup.set(true);
		return;
	}

	authStore.set({ projectId, teamId, token });
	if (showAuthPopup) {
		showAuthPopup.set(false);
	}
};
