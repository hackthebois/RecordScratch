import { decodeBase64IgnorePadding } from "@oslojs/encoding";
import { setOAuthCookies, validateState } from "@recordscratch/auth";
import { getDB } from "@recordscratch/db";
import { Apple, generateState } from "arctic";
import { getQuery, sendRedirect } from "vinxi/http";
import { Route } from "..";

const getApple = (expo: string) => {
	const certificate = `-----BEGIN PRIVATE KEY-----
TmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXANCk5ldmVyIGdvbm5hIGxldCB5b3UgZG93bg0KTmV2ZXIgZ29ubmEgcnVuIGFyb3VuZCBhbmQgZGVzZXJ0IHlvdQ0KTmV2ZXIgZ29ubmEgbWFrZSB5b3UgY3J5DQpOZXZlciBnb25uYSBzYXkgZ29vZGJ5ZQ0KTmV2ZXIgZ29ubmEgdGVsbCBhIGxpZSBhbmQgaHVydCB5b3U
-----END PRIVATE KEY-----`;
	const privateKey = decodeBase64IgnorePadding(
		certificate
			.replace("-----BEGIN PRIVATE KEY-----", "")
			.replace("-----END PRIVATE KEY-----", "")
			.replaceAll("\r", "")
			.replaceAll("\n", "")
			.trim()
	);
	return new Apple(
		process.env.APPLE_CLIENT_ID!,
		process.env.APPLE_TEAM_ID!,
		process.env.APPLE_KEY_ID!,
		privateKey,
		`${process.env.CF_PAGES_URL}/api/auth/apple/callback${expo ? `?expoAddress=${expo}` : ""}`
	);
};

export const appleRoutes: Route[] = [
	[
		"/auth/apple",
		async (event) => {
			const query = getQuery(event);
			const apple = getApple(query.expoAddress as string);

			const state = generateState();
			const url = apple.createAuthorizationURL(state, ["name", "email"]);

			setOAuthCookies(event, state);

			sendRedirect(event, url.toString());
		},
	],
	[
		"/auth/apple/callback",
		async (event) => {
			const db = getDB();
			const query = getQuery(event);
			const apple = getApple(query.expoAddress as string);

			const { code } = validateState(event, false);
		},
	],
];
