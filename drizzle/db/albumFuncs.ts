import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "./config";
import { AlbumRating, NewRating, album_ratings } from "./schema";
import { boolean } from "drizzle-orm/mysql-core";

/**********************************
	Album Rating Database Functions
***********************************/

// Inserts a new album rating
export const insertAlbumRating = async (rating: NewRating) => {
	return db.insert(album_ratings).values(rating);
};

// Updates an existing album rating
export const updateAlbumRating = async (rating: NewRating) => {
	return db
		.update(album_ratings)
		.set(rating)
		.where(
			and(
				eq(album_ratings.albumId, rating.albumId),
				eq(album_ratings.userId, rating.userId)
			)
		);
};

export const getUserRating = async (
	userRating: Omit<AlbumRating, "description">
) => {
	const rating = await db
		.select({
			albumId: album_ratings.albumId,
			userId: album_ratings.userId,
			rating: album_ratings.rating,
			description: album_ratings.description,
		})
		.from(album_ratings)
		.where(
			and(
				eq(album_ratings.userId, userRating.userId),
				eq(album_ratings.albumId, userRating.albumId)
			)
		);

	if (!rating.length) return null;
	else return rating[0];
};
export type GetUserRating = Awaited<ReturnType<typeof getUserRating>>;

// Gets the users album rating
export const userRatingExists = async (
	userRating: Omit<AlbumRating, "description">
) => {
	return (
		(
			await db
				.select({ count: sql<string>`1` })
				.from(album_ratings)
				.where(
					and(
						eq(album_ratings.userId, userRating.userId),
						eq(album_ratings.albumId, userRating.albumId)
					)
				)
				.limit(1)
		).length != 0
	);
};
export type UserAlbumRating = Awaited<ReturnType<typeof boolean>>;

// Gets the total mean average rating for an album
const albumRatingExists = async (albumID: AlbumRating["albumId"]) => {
	return (
		(
			await db
				.select({ count: sql<string>`1` })
				.from(album_ratings)
				.where(eq(album_ratings.albumId, albumID))
				.limit(1)
		).length != 0
	);
};
export const getRatingAverage = async (albumId: AlbumRating["albumId"]) => {
	const albumExists = await albumRatingExists(albumId);

	if (albumExists) {
		const average = await db
			.select({
				ratingAverage: sql<number>`ROUND(AVG(rating), 1)`,
				totalRatings: sql<number>`COUNT(*)`,
			})
			.from(album_ratings)
			.where(eq(album_ratings.albumId, albumId));

		return average[0];
	} else return null;
};
export type AlbumRatingAverage = Awaited<ReturnType<typeof getRatingAverage>>;

// Get the Album mean average for each album provided
export const getAllAlbumAverages = async (albums: AlbumRating["albumId"][]) => {
	const average = await db
		.select({ ratingAverage: sql<string | null>`AVG(rating)` })
		.from(album_ratings)
		.where(inArray(album_ratings.albumId, albums));

	if (!average.length) return null;
	else return average[0].ratingAverage;
};
