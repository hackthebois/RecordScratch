import { env } from "@/env.mjs";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import { AxiomWebVitals } from "next-axiom";
import { Montserrat } from "next/font/google";
import { headers } from "next/headers";
import banner from "../public/og-image.png";
import { PostHogProvider } from "./PostHogProvider";
import { ThemeProvider } from "./ThemeProvider";
import { TRPCReactProvider } from "./_trpc/react";
import "./globals.css";

const montserrat = Montserrat({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "RecordScratch",
		template: "%s | RecordScratch",
	},
	description:
		"Ultimate music-rating and social hub. Find new music, rate your recent listens, and connect with fellow music enthusiasts.",
	metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
	openGraph: {
		images: [banner.src],
		siteName: "RecordScratch",
	},
};

type Props = {
	children: React.ReactNode;
};

export const runtime = "edge";
export const preferredRegion = "cle1";

const RootLayout = ({ children }: Props) => {
	return (
		<html lang="en">
			<AxiomWebVitals />
			<body className={`${montserrat.className} flex flex-col`}>
				<ClerkProvider
					appearance={{
						variables: {
							colorPrimary: "hsl(0 0% 9%)",
							colorDanger: "hsl(0 84.2% 60.2%)",
							borderRadius: "0.5rem",
						},
					}}
				>
					<TRPCReactProvider headers={headers()}>
						<ThemeProvider>
							<PostHogProvider>{children}</PostHogProvider>
						</ThemeProvider>
					</TRPCReactProvider>
				</ClerkProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
};

export default RootLayout;
