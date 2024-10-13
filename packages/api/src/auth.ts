import { getLucia } from "@recordscratch/auth";
import { getDB, profile } from "@recordscratch/db";
import { eq } from "drizzle-orm";

export const getUser = async (sessionId: string) => {
	const lucia = getLucia();
	const db = getDB();
	const { session } = await lucia.validateSession(sessionId);

	if (!session) return null;
	return (
		(await db.query.profile.findFirst({
			where: eq(profile.userId, session.userId),
		})) ?? null
	);
};
