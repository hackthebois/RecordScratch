import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "./config";
import { AlbumRating, NewRating, album_ratings } from "./schema";

/**********************************
	Album Rating Database Functions
***********************************/

// Inserts a new album rating
export const insertAlbumRating = async (rating: NewRating) => {
	return db.insert(album_ratings).values(rating);
};

// Updates an existing album rating
export const updateAlbumRating = async (rating: AlbumRating) => {
	return db
		.update(album_ratings)
		.set(rating)
		.where(eq(album_ratings.albumId, rating.albumId));
};

// Gets the users album rating
export const getAlbumRating = async (
	userRating: Omit<AlbumRating, "description">
) => {
	const rating = await db
		.select({
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
export type UserAlbumRating = Awaited<ReturnType<typeof getAlbumRating>>;

// Gets the total mean average rating for an album
export const getRatingAverage = async (albumId: AlbumRating["albumId"]) => {
	const average = await db
		.select({
			ratingAverage: sql<number | null>`ROUND(AVG(rating))`,
			totalRatings: sql<number>`COUNT(*)`,
		})
		.from(album_ratings)
		.where(eq(album_ratings.albumId, albumId));

	if (!average.length) return null;
	else return average[0];
};
export type AlbumRatingAverage = Awaited<ReturnType<typeof getRatingAverage>>;

// Get the Album mean average for each album provided
export const getAllAlbumAverages = async (albums: AlbumRating["albumId"][]) => {
	const average = await db
		.select({ ratingAverage: sql<number>`AVG(rating)` })
		.from(album_ratings)
		.where(inArray(album_ratings.albumId, albums));

	if (!average.length) return null;
	else return average[0].ratingAverage;
};
