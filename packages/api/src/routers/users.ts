import { users } from "@recordscratch/db";
import { eq } from "drizzle-orm";
import { publicProcedure, router } from "../trpc";

export const usersRouter = router({
	me: publicProcedure.query(async ({ ctx: { db, userId } }) => {
		if (!userId) return null;
		return await db.query.users.findFirst({
			where: eq(users.id, userId),
		});
	}),
});
