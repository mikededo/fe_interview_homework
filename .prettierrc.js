export default {
	singleQuote: true,
	trailingComma: 'es5',
	printWidth: 80,
	arrowParens: 'always',
	semi: true,
	useTabs: true,
	svelteSortOrder: 'options-scripts-styles-markup',
	bracketSameLine: false,
	plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
	overrides: [
		{
			files: ['*.scss', '*.css'],
			options: {
				singleQuote: false,
			},
		},
	],
};
