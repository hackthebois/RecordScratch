import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "./config";
import {
	SongRating,
	SelectSongRating,
	song_ratings,
	SelectRatingType,
	RatingType,
} from "./schema";
import { boolean } from "drizzle-orm/mysql-core";
import { type } from "os";

/**********************************
	Album Rating Database Functions
***********************************/

// Inserts a new song rating
export const insertSongRating = async ({
	resourceId,
	userId,
	rating,
}: RatingType) => {
	await db
		.insert(song_ratings)
		.values({ songId: resourceId, rating: rating, userId: userId });
};
export type InsertSongRating = Awaited<ReturnType<typeof insertSongRating>>;

// Updates an existing song rating
export const updateSongRating = async ({
	resourceId,
	userId,
	rating,
}: RatingType) => {
	await db
		.update(song_ratings)
		.set({ rating: rating })
		.where(
			and(
				eq(song_ratings.songId, resourceId),
				eq(song_ratings.userId, userId)
			)
		);
};
export type UpdateSongRating = Awaited<ReturnType<typeof updateSongRating>>;

// Gets the users song rating
export const getUserSongRating = async ({
	userId,
	resourceId,
}: SelectRatingType) => {
	const rating = await db
		.select()
		.from(song_ratings)
		.where(
			and(
				eq(song_ratings.userId, userId),
				eq(song_ratings.songId, resourceId)
			)
		);

	if (!rating.length) return null;
	else return rating[0];
};
export type GetUserSongRating = Awaited<ReturnType<typeof getUserSongRating>>;

// Gets the users song rating
export const userSongRatingExists = async (
	userRating: Omit<SelectRatingType, "type">
) => {
	return (
		(
			await db
				.select({ count: sql<string>`1` })
				.from(song_ratings)
				.where(
					and(
						eq(song_ratings.userId, userRating.userId),
						eq(song_ratings.songId, userRating.resourceId)
					)
				)
		).length != 0
	);
};
export type UserSongRatingExists = Awaited<
	ReturnType<typeof userSongRatingExists>
>;

// gets the average rating for all songs individually for a specified album
export const getAllSongAverages = async (songIds: string[]) => {
	const allSongRatings = await db
		.select({
			songId: song_ratings.songId,
			ratingAverage: sql<number>`AVG(rating)`,
		})
		.from(song_ratings)
		.groupBy(song_ratings.songId)
		.where(inArray(song_ratings.songId, songIds));

	if (!allSongRatings.length) return null;
	else return allSongRatings;
};
export type SongRatingAverages = Awaited<ReturnType<typeof getAllSongAverages>>;
