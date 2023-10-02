import { and, eq, sql } from "drizzle-orm";
import { db } from "./config";
import { NewSongRating, SongRating, song_ratings } from "./schema";

/**********************************
	Album Rating Database Functions
***********************************/

// Inserts a new song rating
export const insertSongRating = async (rating: NewSongRating) => {
	return db.insert(song_ratings).values(rating);
};

// Updates an existing song rating
export const updateSongRating = async (rating: SongRating) => {
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
export const getSongRating = async (userRating: SongRating) => {
	const rating = await db
		.select({ rating: song_ratings.rating })
		.from(song_ratings)
		.where(
			and(
				eq(song_ratings.userId, userRating.userId),
				eq(song_ratings.songId, userRating.songId)
			)
		);

	if (!rating.length) return null;
	else return rating[0];
};
export type UserSongRating = Awaited<ReturnType<typeof getSongRating>>;

// gets the average rating for all songs individually for a specified album
export const getAllSongAverages = async (albumId: SongRating["albumId"]) => {
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
