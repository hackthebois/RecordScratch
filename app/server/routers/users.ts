import { eq } from "drizzle-orm";
import { users } from "../db/schema";
import { protectedProcedure, router } from "../trpc";

export const usersRouter = router({
	me: protectedProcedure.query(async ({ ctx: { db, userId } }) => {
		return await db.query.users.findFirst({
			where: eq(users.id, userId),
		});
	}),
});
