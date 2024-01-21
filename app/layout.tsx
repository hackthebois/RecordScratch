import { getUrl } from "@/utils/url";
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
	metadataBase: new URL(getUrl()),
	openGraph: {
		images: [banner.src],
		siteName: "RecordScratch",
	},
};

type Props = {
	children: React.ReactNode;
};

// const PostHogPageView = dynamic(
// 	() => import("@/app/_posthog/PostHogPageView"),
// 	{
// 		ssr: false,
// 	}
// );

const RootLayout = ({ children }: Props) => {
	return (
		<html lang="en">
			<body className={`${montserrat.className} flex flex-col`}>
				<Providers>
					{children}
					{/* <Suspense>
						<PostHogPageView />
						<PostHogIdentify />
					</Suspense> */}
				</Providers>
				{/* <SpeedInsights /> */}
			</body>
		</html>
	);
};

export default RootLayout;
