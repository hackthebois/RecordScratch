"use client";

import { useUser } from "@clerk/nextjs";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

const PostHogIdentify = () => {
	const { user } = useUser();
	const posthog = usePostHog();

	useEffect(() => {
		if (user) {
			posthog.identify(user.id, {
				userId: user?.id,
				email: user.primaryEmailAddress?.emailAddress,
			});
		}
	}, [user]);

	return null;
};

export default PostHogIdentify;
