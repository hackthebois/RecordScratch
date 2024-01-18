"use client";

import { env } from "@/env.mjs";
import { useUser } from "@clerk/nextjs";
import posthog from "posthog-js";
import { PostHogProvider as Provider } from "posthog-js/react";
import { useEffect } from "react";
import { trpc } from "./_trpc/react";

// Check that PostHog is client-side (used to handle Next.js SSR)
if (typeof window !== "undefined") {
	posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
		api_host: env.NEXT_PUBLIC_SITE_URL + "/ingest",
		capture_pageview: false, // Disable automatic pageview capture, as we capture manually
	});
}

const IdentifyUser = () => {
	const { user } = useUser();
	const { data: profile } = trpc.user.profile.me.useQuery();

	useEffect(() => {
		if (
			user?.id &&
			user?.primaryEmailAddress?.emailAddress &&
			profile?.handle &&
			profile?.name
		) {
			posthog.identify(user.id, {
				userId: user.id,
				email: user.primaryEmailAddress.emailAddress,
				handle: profile.handle,
				name: profile.name,
			});
		}
	}, [
		user?.id,
		user?.primaryEmailAddress?.emailAddress,
		profile?.handle,
		profile?.name,
	]);

	return null;
};

export const PostHogProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return (
		<Provider client={posthog}>
			{children}
			<IdentifyUser />
		</Provider>
	);
};
