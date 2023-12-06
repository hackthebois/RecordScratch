import { ClerkProvider } from "@clerk/nextjs";
import { AxiomWebVitals } from "next-axiom";
import { Montserrat } from "next/font/google";
import { headers } from "next/headers";
import { TRPCReactProvider } from "./(app)/albums/_trpc/react";
import { Providers } from "./Providers";
import "./globals.css";

const montserrat = Montserrat({
	subsets: ["latin"],
});

export const metadata = {
	title: "RecordScratch",
	description: "Music rating and review app",
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
			<body
				className={`${montserrat.className} flex h-[100svh] flex-col`}
			>
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
						<Providers>{children}</Providers>
					</TRPCReactProvider>
				</ClerkProvider>
			</body>
		</html>
	);
};

export default RootLayout;
