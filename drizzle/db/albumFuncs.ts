import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "./config";
import {
	SelectAlbumRating,
	AlbumRating,
	album_ratings,
	SelectRatingType,
	RatingType,
} from "./schema";

/**********************************
	Album Rating Database Functions
***********************************/

// Inserts a new album rating
export const insertAlbumRating = async ({
	resourceId,
	userId,
	rating,
	description,
}: RatingType) => {
	db.insert(album_ratings).values({
		albumId: resourceId,
		userId: userId,
		rating: rating,
		description: description || "",
	});
};

// Updates an existing album rating
export const updateAlbumRating = async ({
	resourceId,
	userId,
	rating,
	description,
}: RatingType) => {
	return db
		.update(album_ratings)
		.set({
			rating: rating,
			description: description || "",
		})
		.where(
			and(
				eq(album_ratings.albumId, resourceId),
				eq(album_ratings.userId, userId)
			)
		);
};

// Gets the users album rating
export const getUserAlbumRating = async ({
	userId,
	resourceId,
}: SelectRatingType) => {
	const rating = await db
		.select()
		.from(album_ratings)
		.where(
			and(
				eq(album_ratings.userId, userId),
				eq(album_ratings.albumId, resourceId)
			)
		);

	if (!rating.length) return null;
	else return rating[0];
};
export type GetUserAlbumRating = Awaited<ReturnType<typeof getUserAlbumRating>>;

// Gets the users album rating
export const userAlbumRatingExists = async ({
	resourceId,
	userId,
}: SelectRatingType) => {
	return (
		(
			await db
				.select({ count: sql<string>`1` })
				.from(album_ratings)
				.where(
					and(
						eq(album_ratings.userId, userId),
						eq(album_ratings.albumId, resourceId)
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
export const getRatingAverage = async ({
	resourceId,
}: Omit<SelectRatingType, "userId">) => {
	const average = await db
		.select({
			ratingAverage: sql<number>`ROUND(AVG(rating), 1)`,
			totalRatings: sql<number>`COUNT(*)`,
		})
		.from(album_ratings)
		.where(eq(album_ratings.albumId, resourceId));

	if (average[0].totalRatings == 0) return null;
	else return average[0];
};
export type AlbumRatingAverage = Awaited<ReturnType<typeof getRatingAverage>>;

// Get the Album mean average for each album provided
export const getAllAlbumAverages = async (albums: string[]) => {
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
