"use client";

import { Button } from "@/components/ui/Button";
import { useClerk } from "@clerk/nextjs";

const SignInButton = () => {
	const { openSignIn } = useClerk();

	return <Button onClick={() => openSignIn()}>Sign In</Button>;
};

export default SignInButton;
