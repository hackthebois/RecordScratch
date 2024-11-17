import { decodeBase64IgnorePadding } from "@oslojs/encoding";
import {
	handleUser,
	setOAuthCookies,
	validateState,
} from "@recordscratch/auth";
import { Apple, decodeIdToken, generateState } from "arctic";
import { H3Event, getQuery, readBody, sendRedirect } from "vinxi/http";
import { z } from "zod";
import { Route } from "..";

const getApple = (event: H3Event) => {
	const expoAddress = getQuery(event).expoAddress as string;
	const privateKey = decodeBase64IgnorePadding(
		process.env
			.APPLE_PRIVATE_KEY!.replace("-----BEGIN PRIVATE KEY-----", "")
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
		`${process.env.CF_PAGES_URL}/api/auth/apple/callback${expoAddress ? `?expoAddress=${expoAddress}` : ""}`
	);
};

export const appleRoutes: Route[] = [
	[
		"/auth/apple",
		async (event) => {
			const apple = getApple(event);

			const state = generateState();
			const url = apple.createAuthorizationURL(state, ["email"]);
			url.searchParams.set("response_mode", "form_post");

			setOAuthCookies(event, state);

			console.log(url.toString());

			sendRedirect(event, url.toString());
		},
	],
	[
		"/auth/apple/callback",
		async (event) => {
			const apple = getApple(event);

			const { code, formData } = await validateState(event, false);

			const email = (formData.get("email") as string) ?? undefined;

			const tokens = await apple.validateAuthorizationCode(code);
			const { sub } = decodeIdToken(tokens.idToken()) as { sub: string };

			return handleUser(event, { appleId: sub, email });
		},
	],
	[
		"/auth/apple/mobile/callback",
		async (event) => {
			const body = await readBody(event);

			const { idToken, email } = z
				.object({
					idToken: z.string(),
					email: z.string().optional(),
				})
				.parse(body);

			const { sub } = decodeIdToken(idToken) as { sub: string };

			console.log(sub, email);

			return handleUser(event, {
				appleId: sub,
				email,
				onReturn: "sessionId",
			});
		},
	],
];
