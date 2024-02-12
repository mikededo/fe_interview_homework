import type { Config } from 'tailwindcss';

const emoji = [
	'Segoe UI Emoji',
	'Segoe UI Symbol',
	'Segoe UI',
	'Apple Color Emoji',
	'Twemoji Mozilla',
	'Noto Color Emoji',
	'EmojiOne Color',
	'Android Emoji',
	'sans-serif',
];

const fontFamily = [
	'Inter',
	'system-ui',
	'-apple-system',
	'BlinkMacSystemFont',
	'"Segoe UI"',
	'Roboto',
	'"Helvetica Neue"',
	'Arial',
	'"Noto Sans"',
	...emoji,
];



export default {
	content: ['src/**/*.{html,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: fontFamily,
			},
      colors: {
        plum: {
          5: 'var(--color-plum-5)',
          10: 'var(--color-plum-10)',
          20: 'var(--color-plum-20)',
          30: 'var(--color-plum-30)',
          40: 'var(--color-plum-40)',
          50: 'var(--color-plum-50)',
          60: 'var(--color-plum-60)',
          70: 'var(--color-plum-70)',
          80: 'var(--color-plum-80)',
          90: 'var(--color-plum-90)',
          95: 'var(--color-plum-95)',
          100: 'var(--color-plum-100)',
          120: 'var(--color-plum-120)',
          135: 'var(--color-plum-135)',
          highlight: 'var(--color-plum-highlight)',
        },
        shade: {
          5: 'var(--color-shade-5)',
          10: 'var(--color-shade-10)',
          20: 'var(--color-shade-20)',
          30: 'var(--color-shade-30)',
          40: 'var(--color-shade-40)',
          50: 'var(--color-shade-50)',
        },
        light: {
          5: 'var(--color-light-5)',
          10: 'var(--color-light-10)',
          20: 'var(--color-light-20)',
          30: 'var(--color-light-30)',
          40: 'var(--color-light-40)',
          50: 'var(--color-light-50)',
        },
        purple: {
          10: 'var(--color-purple-10)',
          20: 'var(--color-purple-20)',
          30: 'var(--color-purple-30)',
          40: 'var(--color-purple-40)',
          50: 'var(--color-purple-50)',
          60: 'var(--color-purple-60)',
          70: 'var(--color-purple-70)',
          80: 'var(--color-purple-80)',
          90: 'var(--color-purple-90)',
          100: 'var(--color-purple-100)',
          ui: 'var(--color-purple-ui)',
          'ui-hover': 'var(--color-purple-ui-hover)',
          'ui-on-click': 'var(--color-purple-ui-onclick)',
          highlight: 'var(--color-purple-highlight)',
        },
        pink: {
          10: 'var(--color-pink-10)',
          20: 'var(--color-pink-20)',
          30: 'var(--color-pink-30)',
          40: 'var(--color-pink-40)',
          50: 'var(--color-pink-50)',
          60: 'var(--color-pink-60)',
          70: 'var(--color-pink-70)',
          80: 'var(--color-pink-80)',
          90: 'var(--color-pink-90)',
          'ui-hover': 'var(--color-pink-ui-hover)',
          highlight: 'var(--color-pink-highlight)',
        },
        error: {
          default: 'var(--color-error)',
          hover: 'var(--color-error-hover)',
          onclick: 'var(--color-error-onclick)',
          disabled: 'var(--color-error-disabled)',
          highlight: 'var(--color-error-highlight)',
          20: 'var(--color-error-20)',
          '20-hover': 'var(--color-error-20-hover)',
          '20-on-click': 'var(--color-error-20-onclick)',
          '20-disabled': 'var(--color-error-20-disabled)',
        },
        success: {
          default: 'var(--color-success)',
          hover: 'var(--color-success-hover)',
          onclick: 'var(--color-success-onclick)',
          disabled: 'var(--color-success-disabled)',
          highlight: 'var(--color-success-highlight)',
          20: 'var(--color-success-20)',
          '20-hover': 'var(--color-success-20-hover)',
          '20-on-click': 'var(--color-success-20-onclick)',
          '20-disabled': 'var(--color-success-20-disabled)',
        },
        peach: {
          5: 'var(--color-peach-5)',
          10: 'var(--color-peach-10)',
          20: 'var(--color-peach-20)',
          30: 'var(--color-peach-30)',
          40: 'var(--color-peach-40)',
          50: 'var(--color-peach-50)',
          60: 'var(--color-peach-60)',
          70: 'var(--color-peach-70)',
          80: 'var(--color-peach-80)',
          90: 'var(--color-peach-90)',
          100: 'var(--color-peach-100)',
          highlight: 'var(--color-peach-highlight)',
        },
      },
		},
	},
} as Config;

