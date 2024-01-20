import { api } from "@/app/_trpc/react";
import { useUser } from "@clerk/nextjs";
import posthog from "posthog-js";
import { useEffect } from "react";

const IdentifyUser = () => {
	const { user } = useUser();
	const { data: profile } = api.user.profile.me.useQuery(undefined, {
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});

	useEffect(() => {
		if (user?.id && profile) {
			posthog.identify(user.id, {
				userId: user.id,
				email: user.primaryEmailAddress?.emailAddress,
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

export default IdentifyUser;
