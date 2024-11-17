import { getGoogle } from "@/lib/auth/google";
import { setOAuthCookies } from "@recordscratch/auth";
import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import { generateCodeVerifier, generateState } from "arctic";
import { getEvent, sendRedirect } from "vinxi/http";

export const Route = createAPIFileRoute("/api/auth/google")({
	GET: async () => {
		const event = getEvent();
		const google = getGoogle(event);

		const state = generateState();
		const codeVerifier = generateCodeVerifier();

		const url: URL = await google.createAuthorizationURL(
			state,
			codeVerifier,
			["profile", "email"]
		);

		setOAuthCookies(event, state, codeVerifier);

		return new Response(null, {
			status: 302,
			headers: {
				Location: url.toString(),
			},
		});
	},
});
