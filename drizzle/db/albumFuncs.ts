import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "./config";
import { SelectAlbumRating, AlbumRating, album_ratings } from "./schema";

/**********************************
	Album Rating Database Functions
***********************************/

// Inserts a new album rating
export const insertAlbumRating = async (rating: AlbumRating) => {
	return db.insert(album_ratings).values(rating);
};

// Updates an existing album rating
export const updateAlbumRating = async (albumRating: AlbumRating) => {
	return db
		.update(album_ratings)
		.set({
			rating: albumRating.rating,
			description: albumRating.description,
		})
		.where(
			and(
				eq(album_ratings.albumId, albumRating.albumId),
				eq(album_ratings.userId, albumRating.userId)
			)
		);
};

// Gets the users album rating
export const getUserAlbumRating = async (
	userRating: Omit<SelectAlbumRating, "description">
) => {
	const rating = await db
		.select()
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
export type GetUserAlbumRating = Awaited<ReturnType<typeof getUserAlbumRating>>;

// Gets the users album rating
export const userAlbumRatingExists = async (
	userRating: Omit<SelectAlbumRating, "description">
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
export type UserAlbumRatingExists = Awaited<
	ReturnType<typeof userAlbumRatingExists>
>;

// Gets the total mean average rating for an album
export const getRatingAverage = async (
	albumId: SelectAlbumRating["albumId"]
) => {
	const average = await db
		.select({
			ratingAverage: sql<number>`ROUND(AVG(rating), 1)`,
			totalRatings: sql<number>`COUNT(*)`,
		})
		.from(album_ratings)
		.where(eq(album_ratings.albumId, albumId));

	if (average[0].totalRatings == 0) return null;
	else return average[0];
};
export type AlbumRatingAverage = Awaited<ReturnType<typeof getRatingAverage>>;

// Get the Album mean average for each album provided
export const getAllAlbumAverages = async (
	albums: SelectAlbumRating["albumId"][]
) => {
	const average = await db
		.select({ ratingAverage: sql<string | null>`AVG(rating)` })
		.from(album_ratings)
		.where(inArray(album_ratings.albumId, albums));

	if (!average.length) return null;
	else return average[0].ratingAverage;
};
export type GetAllAlbumAverages = Awaited<
	ReturnType<typeof getAllAlbumAverages>
>;
