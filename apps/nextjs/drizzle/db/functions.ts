import { ratings } from "./schema";
import { db } from "./config";
import { and, eq } from "drizzle-orm";

export type NewRating = typeof ratings.$inferInsert;

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
