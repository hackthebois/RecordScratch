import { PostHogIdentify } from "@/components/posthog/PostHogIdentify";
import { env } from "@/env.mjs";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Montserrat } from "next/font/google";
import { Suspense } from "react";
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

const PostHogPageView = dynamic(
	() => import("@/components/posthog/PostHogPageView"),
	{
		ssr: false,
	}
);

const RootLayout = ({ children }: Props) => {
	return (
		<html lang="en">
			<body className={`${montserrat.className} flex flex-col`}>
				<Suspense>
					<Providers>
						{children}
						<PostHogPageView />
						<PostHogIdentify />
					</Providers>
				</Suspense>
				<SpeedInsights />
			</body>
		</html>
	);
};

export default RootLayout;
