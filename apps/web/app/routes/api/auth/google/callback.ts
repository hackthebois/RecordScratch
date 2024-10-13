import { getLucia } from "@recordscratch/auth";
import { getDB, users } from "@recordscratch/db";
import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import { Google } from "arctic";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { getCookie, getEvent, getQuery, setCookie } from "vinxi/http";
import { z } from "zod";

export const Route = createAPIFileRoute("/api/auth/google/callback")({
	GET: async () => {
		const event = getEvent();
		const db = getDB();
		const lucia = getLucia();

		// Validations
		const query = getQuery(event);
		const code = z.string().parse(query.code);
		const state = z.string().parse(query.state);
		const storedState = getCookie(event, "state");
		const storedCodeVerifier = getCookie(event, "codeVerifier");

		const expoAddress = query.expoAddress?.toString();

		const google = new Google(
			process.env.GOOGLE_CLIENT_ID!,
			process.env.GOOGLE_CLIENT_SECRET!,
			`${process.env.CF_PAGES_URL}/api/auth/google/callback${expoAddress ? `?expoAddress=${expoAddress}` : ""}`
		);

		if (
			!code ||
			!storedState ||
			!storedCodeVerifier ||
			state !== storedState
		) {
			return json({ message: "Invalid request" }, { status: 400 });
		}

		const tokens = await google.validateAuthorizationCode(
			code,
			storedCodeVerifier
		);
		const response = await fetch(
			"https://openidconnect.googleapis.com/v1/userinfo",
			{
				headers: {
					Authorization: `Bearer ${tokens.accessToken}`,
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

		let userId: string;
		const existingUser = await db.query.users.findFirst({
			where: eq(users.googleId, googleId),
		});

		let redirect;
		if (!existingUser) {
			userId = generateId(15);
			await db.insert(users).values({
				id: userId,
				email,
				googleId,
			});
			redirect = "/onboard";
		} else {
			userId = existingUser.id;
			redirect = "/";
		}

		const session = await lucia.createSession(userId, {
			email,
			googleId,
		});
		const sessionCookie = lucia.createSessionCookie(session.id);

		if (expoAddress) redirect = `${expoAddress}?session_id=${session.id}`;
		else
			setCookie(
				event,
				sessionCookie.name,
				sessionCookie.value,
				sessionCookie.attributes
			);

		return Response.redirect(process.env.CF_PAGES_URL + redirect);
	},
});
