import { writable } from 'svelte/store';

export const isSidenavHidden = writable(true);
export const toggleSidenav = () => isSidenavHidden.update((value) => !value);
