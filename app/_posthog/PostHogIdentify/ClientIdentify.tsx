"use client";

import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

export const ClientIdentify = (posthogIdentity: {
	userId: string;
	email?: string;
	handle: string;
	name: string;
}) => {
	const posthog = usePostHog();

	useEffect(() => {
		posthog.identify(posthogIdentity.userId, posthogIdentity);
	}, []);

	return null;
};
