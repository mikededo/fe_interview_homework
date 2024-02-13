const get = (key: string): string | null => {
	// Ensure in browser and when user has localStorage active
	if (
		typeof window === 'undefined' ||
		typeof window.localStorage === 'undefined'
	) {
		return null;
	}

	return window.localStorage.getItem(key);
};

const set = (key: string, value: string): void => {
	if (
		typeof window === 'undefined' ||
		typeof window.localStorage === 'undefined'
	) {
		return;
	}

	window.localStorage.setItem(key, value);
};

export const LocalStorage = { get, set };
