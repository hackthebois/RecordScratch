import {
	handleUser,
	setOAuthCookies,
	validateState,
} from "@recordscratch/auth";
import { Google, generateCodeVerifier, generateState } from "arctic";
import { H3Event, getQuery, sendRedirect } from "vinxi/http";
import { z } from "zod";
import { Route } from "..";

const getGoogle = (event: H3Event) => {
	const expoAddress = getQuery(event).expoAddress as string;
	return new Google(
		process.env.GOOGLE_CLIENT_ID!,
		process.env.GOOGLE_CLIENT_SECRET!,
		`${process.env.CF_PAGES_URL}/api/auth/google/callback${expoAddress ? `?expoAddress=${expoAddress}` : ""}`
	);
};

export const googleRoutes: Route[] = [
	[
		"/auth/google",
		async (event) => {
			const google = getGoogle(event);

			const state = generateState();
			const codeVerifier = generateCodeVerifier();

			const url: URL = await google.createAuthorizationURL(
				state,
				codeVerifier,
				["profile", "email"]
			);

			setOAuthCookies(event, state, codeVerifier);

			return sendRedirect(event, url.toString());
		},
	],
	[
		"/auth/google/callback",
		async (event) => {
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
	],
];
