"use client";

import { revalidateTagAction } from "@/app/_api/actions";
import { Button } from "@/components/ui/Button";
import { useClerk, useUser } from "@clerk/nextjs";
import { usePostHog } from "posthog-js/react";

export const SignOutButton = () => {
	const { signOut } = useClerk();
	const { user } = useUser();
	const posthog = usePostHog();

	return (
		<Button
			variant="outline"
			onClick={() => {
				signOut();
				if (user) revalidateTagAction(user.id);
				user?.reload();
				posthog.reset();
			}}
		>
			Sign out
		</Button>
	);
};
