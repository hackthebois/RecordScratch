import {
	userAlbumRatingExists,
	getAllAlbumAverages,
	getRatingAverage,
	insertAlbumRating,
	updateAlbumRating,
	getUserAlbumRating,
} from "@/drizzle/db/albumFuncs";
import { AlbumSchema, SelectAlbumSchema } from "@/drizzle/db/schema";
import redis from "@/redis/config";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./trpc";

interface RatingData {
	ratingAverage: string;
	totalRatings: string;
}

export const albumRouter = router({
	// Input the user rating for an album
	rateAlbum: protectedProcedure
		.input(
			AlbumSchema.pick({
				albumId: true,
				rating: true,
				description: true,
			})
		)
		.mutation(
			async ({
				ctx: { userId },
				input: { albumId, rating, description },
			}) => {
				const ratingExists: boolean = await userAlbumRatingExists({
					albumId,
					userId,
				});

				if (!ratingExists)
					await insertAlbumRating({
						albumId,
						rating,
						description,
						userId,
					});
				else {
					await redis.del(albumId);
					await updateAlbumRating({
						albumId,
						rating,
						description,
						userId,
					});
				}
			}
		),

	// Gets the users rating for an album
	getUserRating: protectedProcedure
		.input(SelectAlbumSchema.pick({ albumId: true }))
		.query(async ({ ctx: { userId }, input: { albumId } }) => {
			return await getUserAlbumRating({ albumId, userId });
		}),

	// Get the overall mean average for one album
	getAlbumAverage: publicProcedure
		.input(SelectAlbumSchema.pick({ albumId: true }))
		.query(async ({ input: { albumId } }) => {
			// Retrieve the value from Redis
			const cachedValue: RatingData = (await redis.get(
				albumId
			)) as RatingData;

			if (cachedValue) return cachedValue;
			else {
				// Database Call
				const average = await getRatingAverage(albumId);

				// Set a key-value pair in Redis
				await redis.set(albumId, JSON.stringify(average));
				await redis.expire(albumId, 86400); // 24h experation

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
				console.log("s");
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
});
