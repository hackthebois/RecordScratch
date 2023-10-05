import { and, eq, sql } from "drizzle-orm";
import { db } from "./config";
import { SongRating, SelectSongRating, song_ratings } from "./schema";
import { boolean } from "drizzle-orm/mysql-core";

/**********************************
	Album Rating Database Functions
***********************************/

// Inserts a new song rating
export const insertSongRating = async (rating: SongRating) => {
	await db.insert(song_ratings).values(rating);
};
export type InsertSongRating = Awaited<ReturnType<typeof insertSongRating>>;

// Updates an existing song rating
export const updateSongRating = async (rating: SongRating) => {
	return db
		.update(song_ratings)
		.set(rating)
		.where(
			and(
				eq(song_ratings.albumId, rating.albumId),
				eq(song_ratings.songId, rating.songId),
				eq(song_ratings.userId, rating.userId)
			)
		);
};

// Gets the users song rating
export const getUserSongRating = async (userRating: SelectSongRating) => {
	const rating = await db
		.select()
		.from(song_ratings)
		.where(
			and(
				eq(song_ratings.userId, userRating.userId),
				eq(song_ratings.songId, userRating.songId),
				eq(song_ratings.albumId, userRating.albumId)
			)
		);

	if (!rating.length) return null;
	else return rating[0];
};
export type GetUserSongRating = Awaited<ReturnType<typeof getUserSongRating>>;

// Gets the users song rating
export const userSongRatingExists = async (userRating: SelectSongRating) => {
	return (
		(
			await db
				.select({ count: sql<string>`1` })
				.from(song_ratings)
				.where(
					and(
						eq(song_ratings.userId, userRating.userId),
						eq(song_ratings.songId, userRating.songId),
						eq(song_ratings.albumId, userRating.albumId)
					)
				)
		).length != 0
	);
};
export type UserSongRatingExists = Awaited<ReturnType<typeof boolean>>;

// gets the average rating for all songs individually for a specified album
export const getAllSongAverages = async (
	albumId: SelectSongRating["albumId"]
) => {
	const allSongRatings = await db
		.select({
			songId: song_ratings.songId,
			ratingAverage: sql<number>`AVG(rating)`,
		})
		.from(song_ratings)
		.groupBy(song_ratings.songId)
		.where(eq(song_ratings.albumId, albumId));

	if (!allSongRatings.length) return null;
	else return allSongRatings;
};
export type SongRatingAverages = Awaited<ReturnType<typeof getAllSongAverages>>;
