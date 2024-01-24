"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const SignInWrapper = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();

	return (
		<Link href={`/sign-in?redirect_url=${pathname}`} prefetch={false}>
			{children}
		</Link>
	);
};
