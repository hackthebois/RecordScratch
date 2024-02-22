import { env } from "@/env";
import React from "react";

export const SignInWrapper = ({ children }: { children: React.ReactNode }) => {
	return <a href={env.VITE_BASE_URL + "/auth/google"}>{children}</a>;
};
