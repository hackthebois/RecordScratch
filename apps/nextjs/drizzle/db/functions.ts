import { and, eq } from "drizzle-orm";
import { db } from "./config";
import { NewRating, SelectRating, ratings } from "./schema";

// Inserts a new album rating
export const insertRating = async (rating: NewRating) => {
	return db.insert(ratings).values(rating);
};

// Gets the users album rating
export const getRating = async (userRating: SelectRating) => {
	const rating = await db
		.select({ rating: ratings.rating })
		.from(ratings)
		.where(
			and(
				eq(ratings.userId, userRating.userId),
				eq(ratings.albumId, userRating.albumId)
			)
		);

	if (!rating.length) return null;
	else return rating[0];
};
