import { and, count, desc, eq } from "drizzle-orm";
import { notifications } from "../db/schema";
import { protectedProcedure, router } from "../trpc";

export const notificationsRouter = router({
	get: protectedProcedure.query(async ({ ctx: { db, userId } }) => {
		return await db.query.notifications.findMany({
			where: eq(notifications.userId, userId),
			with: {
				from: true,
				rating: true,
			},
			orderBy: [desc(notifications.createdAt)],
		});
	}),
	getUnseen: protectedProcedure.query(async ({ ctx: { db, userId } }) => {
		const unseen = await db
			.select({
				count: count(),
			})
			.from(notifications)
			.where(
				and(
					eq(notifications.userId, userId),
					eq(notifications.seen, false)
				)
			);
		return unseen[0].count;
	}),
	markAllSeen: protectedProcedure.mutation(
		async ({ ctx: { db, userId } }) => {
			await db
				.update(notifications)
				.set({ seen: true })
				.where(
					and(
						eq(notifications.userId, userId),
						eq(notifications.seen, false)
					)
				);
		}
	),
});
