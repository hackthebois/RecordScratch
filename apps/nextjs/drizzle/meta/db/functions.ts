import { db } from "@/drizzle/db/config";
import { album_ratings } from "@/drizzle/db//schema";

// Basic Rating Insert function
export type NewRating = typeof album_ratings.$inferInsert;

export const insertUser = async (rating: NewRating) => {
	return db.insert(album_ratings).values(rating);
};
