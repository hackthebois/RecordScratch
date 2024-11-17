import { getGoogle } from "@/lib/auth/google";
import { handleUser, validateState } from "@recordscratch/auth";
import { createAPIFileRoute } from "@tanstack/start/api";
import { getEvent } from "vinxi/http";
import { z } from "zod";

export const Route = createAPIFileRoute("/api/auth/google/callback")({
	GET: async () => {
		const event = getEvent();
		const google = getGoogle(event);

		const { code, codeVerifier } = await validateState(event, true);

		const tokens = await google.validateAuthorizationCode(
			code,
			codeVerifier
		);

		// Get user email and googleId
		const response = await fetch(
			"https://openidconnect.googleapis.com/v1/userinfo",
			{
				headers: {
					Authorization: `Bearer ${tokens.accessToken()}`,
				},
			}
		);
		const user: unknown = await response.json();
		const { sub: googleId, email } = z
			.object({
				sub: z.string(),
				email: z.string(),
			})
			.parse(user);

		return handleUser(event, { googleId, email });
	},
});
