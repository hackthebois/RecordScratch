import { getUrl } from "@/utils/url";
import { auth, currentUser } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Montserrat } from "next/font/google";
import { cookies } from "next/headers";
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
	metadataBase: new URL(getUrl()),
	openGraph: {
		images: [banner.src],
		siteName: "RecordScratch",
	},
};

type Props = {
	children: React.ReactNode;
};

const PostHogPageView = dynamic(
	() => import("@/app/_posthog/PostHogPageView"),
	{
		ssr: false,
	}
);

const PostHogIdentify = dynamic(
	() => import("@/app/_posthog/PostHogIdentify"),
	{
		ssr: false,
	}
);

const PostHog = async () => {
	cookies();
	const { userId } = auth();

	if (!userId) return null;

	const user = await currentUser();

	return (
		<PostHogIdentify
			userId={userId}
			email={
				user?.emailAddresses.length
					? user?.emailAddresses[0].emailAddress
					: undefined
			}
		/>
	);
};

export const runtime = "edge";
export const preferredRegion = ["cle1"];

const RootLayout = ({ children }: Props) => {
	return (
		<html lang="en">
			<body className={`${montserrat.className} flex flex-col`}>
				<Providers>
					{children}
					<PostHogPageView />
					<Suspense>
						<PostHog />
					</Suspense>
				</Providers>
				<SpeedInsights />
			</body>
		</html>
	);
};

export default RootLayout;
