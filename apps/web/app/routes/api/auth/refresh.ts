import { getLucia } from "@recordscratch/auth";
import { getDB, sessions, users } from "@recordscratch/db";
import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import { eq } from "drizzle-orm";

export const Route = createAPIFileRoute("/api/auth/refresh")({
	GET: async ({ request }) => {
		const params = new URL(request.url).searchParams;
		const sessionId = params.get("sessionId");
		if (!sessionId) return json({ sessionId: null });

		const db = getDB();
		const lucia = getLucia();

		const googleId =
			(
				await db
					.select({ googleId: users.googleId })
					.from(sessions)
					.innerJoin(users, eq(users.id, sessions.userId))
					.where(eq(sessions.id, sessionId))
			)[0]?.googleId || null;

		if (!googleId) return json({ sessionId: null });

		await lucia.invalidateSession(sessionId);

		const existingUser = await db.query.users.findFirst({
			where: eq(users.googleId, googleId),
		});
		const userId = existingUser!.id;
		const email = existingUser!.email;

		const session = await lucia.createSession(userId, {
			email,
			googleId,
		});

		return json({ sessionId: session.id });
	},
});
