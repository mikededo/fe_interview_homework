import { writable } from 'svelte/store';

type ErrorStore = {
	exists: boolean;
	message?: string;
};

export const errorStore = writable<ErrorStore>({ exists: false });
export const setError = (message: string) =>
	errorStore.set({ exists: true, message });
export const clearError = () =>
	errorStore.update((prev) => ({ ...prev, exists: false }));
