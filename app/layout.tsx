import { env } from "@/env.mjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import { Montserrat } from "next/font/google";
import banner from "../public/og-image.png";
import Providers from "./Providers";
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

const RootLayout = ({ children }: Props) => {
	return (
		<html lang="en">
			<body className={`${montserrat.className} flex flex-col`}>
				<Providers>{children}</Providers>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
};

export default RootLayout;
