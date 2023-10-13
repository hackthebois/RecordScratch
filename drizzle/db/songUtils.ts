import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "./config";
import { RatingCategory, ratings } from "./schema";

/**********************************
	Song  Rating Database Functions
***********************************/

// gets the average rating for all songs individually for a specified album
export const getAllSongAverages = async (songIds: string[]) => {
	const allSongRatings = await db
		.select({
			songId: ratings.resourceId,
			ratingAverage: sql<number>`ROUND(AVG(rating), 1)`,
			totalRatings: sql<number>`COUNT(*)`,
		})
		.from(ratings)
		.groupBy(ratings.resourceId)
		.where(
			and(
				inArray(ratings.resourceId, songIds),
				eq(ratings.category, RatingCategory.SONG)
			)
		);

	if (!allSongRatings.length) return null;
	else return allSongRatings;
};
export type SongRatingAverages = Awaited<ReturnType<typeof getAllSongAverages>>;

// gets the average rating for all songs individually for a specified album
export const getAllUserSongRatings = async (
	songIds: string[],
	userId: string
) => {
	const allSongRatings = await db
		.select()
		.from(ratings)
		.where(
			and(
				inArray(ratings.resourceId, songIds),
				eq(ratings.userId, userId)
			)
		);

	if (!allSongRatings.length) return null;
	else return allSongRatings;
};
export type UserSongRatings = Awaited<ReturnType<typeof getAllUserSongRatings>>;
