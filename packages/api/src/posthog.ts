import type { CreateProfile, RateForm, ReviewForm } from "@recordscratch/types";
import { PostHog } from "posthog-node";

type PostHogEvent = {
	profile_created: CreateProfile;
	rate: RateForm;
	review: ReviewForm;
};

export const getPostHog = () => {
	const ph = new PostHog(process.env.VITE_POSTHOG_KEY!, {
		host: process.env.VITE_POSTHOG_HOST,
	});

	return ph;
};

export const posthog = async <TEvent extends keyof PostHogEvent>(
	ph: PostHog,
	events: [
		TEvent,
		{
			distinctId: string;
			properties: PostHogEvent[TEvent];
		},
	][]
) => {
	events.forEach(([event, payload]) => {
		ph.capture({
			distinctId: payload.distinctId,
			event,
			properties: {
				...payload.properties,
				$host: process.env.CF_PAGES_URL!.replace(/^https?:\/\//, ""),
			},
		});
	});
	await ph.shutdown();
};
