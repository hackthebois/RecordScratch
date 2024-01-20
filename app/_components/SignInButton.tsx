"use client";

import { Button } from "@/app/_components/ui/Button";
import { useClerk } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

const SignInButton = () => {
	const { openSignIn } = useClerk();
	const clerkTheme = useTheme().theme === "dark" ? dark : undefined;

	return (
		<Button
			onClick={() =>
				openSignIn({
					appearance: {
						baseTheme: clerkTheme,
					},
				})
			}
		>
			Sign In
		</Button>
	);
};

export default SignInButton;
