import { and, eq, sql } from "drizzle-orm";
import { db } from "./config";
import { NewSongRating, SongRating, song_ratings } from "./schema";
import { boolean } from "drizzle-orm/mysql-core";

/**********************************
	Album Rating Database Functions
***********************************/

// Inserts a new song rating
export const insertSongRating = async (rating: NewSongRating) => {
	return db.insert(song_ratings).values(rating);
};

// Updates an existing song rating
export const updateSongRating = async (rating: NewSongRating) => {
	return db
		.update(song_ratings)
		.set(rating)
		.where(
			and(
				eq(song_ratings.albumId, rating.albumId),
				eq(song_ratings.songId, rating.songId)
			)
		);
};

// Gets the users song rating
export const getUserRating = async (userRating: SongRating) => {
	const rating = await db
		.select({
			albumId: song_ratings.albumId,
			songId: song_ratings.songId,
			userId: song_ratings.userId,
			rating: song_ratings.rating,
		})
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
export type GetUserRating = Awaited<ReturnType<typeof getUserRating>>;

// Gets the users song rating
export const userRatingExists = async (userRating: SongRating) => {
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
export type UserRatingExists = Awaited<ReturnType<typeof boolean>>;

// gets the average rating for all songs individually for a specified album
export const getAllSongAverages = async (albumId: SongRating["albumId"]) => {
	const allSongRatings = await db
		.select({
			songId: song_ratings.songId,
			ratingAverage: sql<string | null>`AVG(rating)`,
		})
		.from(song_ratings)
		.groupBy(song_ratings.songId)
		.where(eq(song_ratings.albumId, albumId));

	if (!allSongRatings.length) return null;
	else return allSongRatings;
};
export type SongRatingAverages = Awaited<ReturnType<typeof getAllSongAverages>>;
