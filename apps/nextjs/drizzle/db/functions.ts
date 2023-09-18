import { and, eq } from "drizzle-orm";
import { db } from "./config";
import { ratings } from "./schema";

export type NewRating = typeof ratings.$inferInsert;
export type Rating = typeof ratings.$inferSelect;

// Inserts a new album rating
export const insertUser = async (rating: NewRating) => {
	return db.insert(ratings).values(rating);
};

// Gets the users album rating
export const getRating = async (userId: string, albumId: string) => {
	return await db
		.select({ rating: ratings.rating })
		.from(ratings)
		.where(and(eq(ratings.userId, userId), eq(ratings.albumId, albumId)));
};
