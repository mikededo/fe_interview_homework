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

export const LocalStorage = { get };
