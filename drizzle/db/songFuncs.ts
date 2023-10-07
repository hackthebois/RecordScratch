import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "./config";
import {
	RatingCategory,
	SelectRatingType,
	UserRating,
	song_ratings,
} from "./schema";

/**********************************
	Album Rating Database Functions
***********************************/

// Inserts a new song rating
export const insertSongRating = async ({
	resourceId,
	userId,
	rating,
}: UserRating) => {
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
}: UserRating) => {
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
}: SelectRatingType): Promise<UserRating | null> => {
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
	else {
		const { songId, ...rest } = rating[0];
		return {
			resourceId: songId,
			description: "",
			type: RatingCategory.SONG,
			...rest,
		};
	}
};
export type GetUserSongRating = Awaited<ReturnType<typeof getUserSongRating>>;

// Gets the users song rating
export const userSongRatingExists = async ({
	userId,
	resourceId,
}: SelectRatingType) => {
	return (
		(
			await db
				.select({ count: sql<string>`1` })
				.from(song_ratings)
				.where(
					and(
						eq(song_ratings.userId, userId),
						eq(song_ratings.songId, resourceId)
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
