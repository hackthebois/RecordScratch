import { env } from "@/env.mjs";

type ServerEvents = {
	"spotify request": {
		endpoint: string;
	};
};

export const logServerEvent = async <TEventKey extends keyof ServerEvents>(
	event: TEventKey,
	payload: {
		distinctId: string;
		properties: ServerEvents[TEventKey];
	}
) => {
	await fetch(`${env.NEXT_PUBLIC_POSTHOG_HOST}/capture`, {
		method: "POST",
		body: JSON.stringify({
			api_key: env.NEXT_PUBLIC_POSTHOG_KEY,
			distinct_id: payload.distinctId,
			event,
			properties: {
				...payload.properties,
				environment: env.NODE_ENV,
			},
		}),
	});
};
