import type { Config } from "tailwindcss";

// @ts-expect-error - no types
import nativewind from "nativewind/preset";
import { hairlineWidth } from "nativewind/theme";

export default {
	darkMode: "class",
	content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
	presets: [nativewind],
	theme: {
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderWidth: {
				hairline: hairlineWidth(),
			},
			fontFamily: {
				thin: "Montserrat_100Thin",
				extralight: "Montserrat_200ExtraLight",
				light: "Montserrat_300Light",
				regular: "Montserrat_400Regular",
				medium: "Montserrat_500Medium",
				semibold: "Montserrat_600SemiBold",
				bold: "Montserrat_700Bold",
				extrabold: "Montserrat_800ExtraBold",
				black: "Montserrat_900Black",
			},
		},
	},
	plugins: [],
} satisfies Config;
