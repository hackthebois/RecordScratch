"use client";

import { Button } from "@/components/ui/Button";
import { useClerk } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

const SignInButton = () => {
	const { openSignIn } = useClerk();
	const clerkTheme = useTheme().theme === "dark" ? dark : undefined;
	const pathname = usePathname();

	return (
		<Button
			onClick={() =>
				openSignIn({
					appearance: {
						baseTheme: clerkTheme,
					},
					afterSignInUrl: pathname,
				})
			}
		>
			Sign In
		</Button>
	);
};

export default SignInButton;
