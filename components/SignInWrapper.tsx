"use client";

import { useClerk } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import React from "react";

export const SignInWrapper = ({ children }: { children: React.ReactNode }) => {
	const { openSignIn } = useClerk();
	const clerkTheme = useTheme().theme === "dark" ? dark : undefined;

	return (
		<span
			onClick={() => {
				openSignIn({
					redirectUrl: undefined,
					appearance: { baseTheme: clerkTheme },
				});
			}}
		>
			{children}
		</span>
	);
};
