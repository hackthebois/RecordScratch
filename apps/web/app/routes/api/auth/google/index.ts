import { createAPIFileRoute } from "@tanstack/start/api";
import { Google, generateCodeVerifier, generateState } from "arctic";
import { getEvent, getQuery, setCookie } from "vinxi/http";

export const Route = createAPIFileRoute("/api/auth/google")({
	GET: async () => {
		const event = getEvent();
		const query = getQuery(event);

		const expoAddress = query.expoAddress?.toString();

		const google = new Google(
			process.env.GOOGLE_CLIENT_ID!,
			process.env.GOOGLE_CLIENT_SECRET!,
			`${process.env.CF_PAGES_URL}/api/auth/google/callback${expoAddress ? `?expoAddress=${expoAddress}` : ""}`
		);

		const state = generateState();
		const codeVerifier = generateCodeVerifier();

		const url: URL = await google.createAuthorizationURL(
			state,
			codeVerifier,
			{
				scopes: ["profile", "email"],
			}
		);

		setCookie(event, "state", state, {
			secure: process.env.NODE_ENV === "production",
			path: "/",
			httpOnly: true,
			maxAge: 60 * 10, // 10 min
		});

		setCookie(event, "codeVerifier", codeVerifier, {
			secure: process.env.NODE_ENV === "production",
			path: "/",
			httpOnly: true,
			maxAge: 60 * 10, // 10 min
		});

		return Response.redirect(url.toString());
	},
});
