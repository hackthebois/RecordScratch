"use client";

import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

const PostHogIdentify = ({
	userId,
	email,
}: {
	userId: string;
	email?: string;
}) => {
	const posthog = usePostHog();

	useEffect(() => {
		posthog.identify(userId, {
			email,
		});
	}, []);

	return null;
};

export default PostHogIdentify;
