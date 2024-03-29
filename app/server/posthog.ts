import { env } from "@/env";
import { CreateProfile } from "@/types/profile";
import { RateForm, ReviewForm } from "@/types/rating";
import { PostHog } from "posthog-node";

type PostHogEvent = {
	profile_created: CreateProfile;
	rate: RateForm;
	review: ReviewForm;
};

const ph = new PostHog(env.VITE_POSTHOG_KEY, {
	host: process.env.CF_PAGES_URL + "/ingest",
});

export const posthog = <TEvent extends keyof PostHogEvent>(
	event: TEvent,
	payload: {
		distinctId: string;
		properties: PostHogEvent[TEvent];
	}
) => {
	ph.capture({
		distinctId: payload.distinctId,
		event,
		properties: {
			...payload.properties,
			$host: process.env.CF_PAGES_URL!.replace(/^https?:\/\//, ""),
		},
	});
};
