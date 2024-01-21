"use client";

import {
	ClerkProvider,
	SignedIn as ClerkSignedIn,
	SignedOut as ClerkSignedOut,
} from "@clerk/nextjs";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<ClerkProvider
			appearance={{
				variables: {
					colorPrimary: "hsl(0 0% 9%)",
					colorDanger: "hsl(0 84.2% 60.2%)",
					borderRadius: "0.5rem",
				},
			}}
		>
			{children}
		</ClerkProvider>
	);
};

export const SignedIn = ClerkSignedIn;
export const SignedOut = ClerkSignedOut;

export default AuthProvider;
