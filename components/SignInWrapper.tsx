"use client";

import { useClerk } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import React from "react";

export const SignInWrapper = ({ children }: { children: React.ReactNode }) => {
	const { openSignIn } = useClerk();
	const { theme, systemTheme } = useTheme();
	const currentTheme = theme === "system" ? systemTheme : theme;
	const clerkTheme = currentTheme === "dark" ? dark : undefined;
	const pathname = usePathname();

	return (
		<span
			onClick={() => {
				openSignIn({
					redirectUrl: undefined,
					appearance: { baseTheme: clerkTheme },
					afterSignInUrl: pathname,
				});
			}}
		>
			{children}
		</span>
	);
};
