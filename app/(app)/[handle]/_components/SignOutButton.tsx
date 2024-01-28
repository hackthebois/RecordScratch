"use client";

import { revalidateTagAction } from "@/app/_api/actions";
import { Button } from "@/components/ui/Button";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";

export const SignOutButton = () => {
	const { signOut } = useClerk();
	const { user } = useUser();
	const posthog = usePostHog();
	const router = useRouter();

	return (
		<Button
			variant="outline"
			onClick={() => {
				signOut(() => {
					if (user) revalidateTagAction(user.id);
					posthog.reset();
					router.push("/");
				});
			}}
		>
			Sign out
		</Button>
	);
};
