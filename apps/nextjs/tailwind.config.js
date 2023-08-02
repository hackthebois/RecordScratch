/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
		"./app/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				"elevation-1": "#121212",
				"elevation-2": "#222222",
				"elevation-3": "#272727",
				"elevation-4": "#2c2c2c",
			},
		},
	},
	plugins: [],
};
