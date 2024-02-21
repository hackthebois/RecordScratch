import { useClerk } from "@clerk/clerk-react";
import React from "react";

export const SignInWrapper = ({ children }: { children: React.ReactNode }) => {
	const { openSignIn } = useClerk();

	return <button onClick={() => openSignIn()}>{children}</button>;
};
