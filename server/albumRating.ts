import {
	userAlbumRatingExists,
	getAllAlbumAverages,
	getRatingAverage,
	insertAlbumRating,
	updateAlbumRating,
	getUserAlbumRating,
} from "@/drizzle/db/albumFuncs";
import {
	AlbumSchema,
	RatingCategory,
	RatingDTO,
	SelectAlbumSchema,
	SelectRatingDTO,
} from "@/drizzle/db/schema";
import redis from "@/redis/config";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./trpc";
import {
	getAllSongAverages,
	getUserSongRating,
	insertSongRating,
	updateSongRating,
	userSongRatingExists,
} from "@/drizzle/db/songFuncs";

interface RatingData {
	ratingAverage: string;
	totalRatings: string;
}

export const albumRouter = router({
	// Input the user rating for an album
	rateAlbum: protectedProcedure
		.input(RatingDTO)
		.mutation(
			async ({
				ctx: { userId },
				input: { resourceId, type, rating, description },
			}) => {
				const ratingExists =
					type == RatingCategory.ALBUM
						? await userAlbumRatingExists({
								resourceId,
								userId,
						  })
						: await userSongRatingExists({
								userId,
								resourceId,
						  });

				if (!ratingExists) {
					if (type == RatingCategory.ALBUM)
						await insertAlbumRating({
							resourceId,
							userId,
							rating,
							description,
						});
					else await insertSongRating({ resourceId, userId, rating });
				} else {
					if (type == RatingCategory.ALBUM) {
						await redis.del(resourceId);
						await updateAlbumRating({
							resourceId,
							rating,
							description,
							userId,
						});
					} else
						await updateSongRating({ resourceId, userId, rating });
				}
			}
		),

	// Gets the users rating for an album
	getUserRating: protectedProcedure
		.input(SelectRatingDTO)
		.query(async ({ ctx: { userId }, input: { resourceId, type } }) => {
			return type == RatingCategory.ALBUM
				? await getUserAlbumRating({ resourceId, userId })
				: await getUserSongRating({ resourceId, userId });
		}),

	// Get the overall mean average for one album
	getAlbumAverage: publicProcedure
		.input(SelectRatingDTO)
		.query(async ({ input: { resourceId } }) => {
			// Retrieve the value from Redis
			const cachedValue: RatingData = (await redis.get(
				resourceId
			)) as RatingData;

			if (cachedValue) return cachedValue;
			else {
				// Database Call
				const average = await getRatingAverage({ resourceId });

				// Set a key-value pair in Redis
				await redis.set(resourceId, JSON.stringify(average));
				await redis.expire(resourceId, 86400); // 24h experation

				return average;
			}
		}),

	// Get the overall mean average for All given albums
	getEveryAlbumAverage: publicProcedure
		.input(z.object({ id: z.string(), albums: z.string().array() }))
		.query(async ({ input: { id, albums } }) => {
			// Retrieve the value from Redis
			const cachedValue = (await redis.get(id)) as string;

			if (cachedValue) {
				return cachedValue;
			} else {
				// Database Call
				const average = await getAllAlbumAverages(albums);

				// Set a key-value pair in Redis
				await redis.set(id, JSON.stringify(average));
				await redis.expire(id, 86400); // 24h experation

				return average;
			}
		}),

	// Gets the mean average rating for a song
	getAllAverageSongRatings: publicProcedure
		.input(z.object({ songIds: z.string().array() }))
		.query(async ({ input: { songIds } }) => {
			return getAllSongAverages(songIds);
		}),
});
