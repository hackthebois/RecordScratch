import {
	userRatingExists,
	getAllAlbumAverages,
	getRatingAverage,
	insertAlbumRating,
	updateAlbumRating,
} from "@/drizzle/db/albumFuncs";
import { NewAlbumSchema, SelectAlbumSchema } from "@/drizzle/db/schema";
import redis from "@/redis/config";
import { TRPCError } from "@trpc/server";
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
			NewAlbumSchema.pick({
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
				console.log(userId);

				const ratingExists: boolean = await userRatingExists({
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
				else
					await updateAlbumRating({
						albumId,
						rating,
						description,
						userId,
					});
			}
		),

	// Gets the users rating for an album
	getUserRating: protectedProcedure
		.input(SelectAlbumSchema.pick({ albumId: true }))
		.query(async (opts) => {
			const userId: string = opts.ctx.userId;
			const albumId: string = opts.input.albumId;

			return await userRatingExists({ albumId, userId });
		}),

	// Get the overall mean average for one album
	getAlbumAverage: publicProcedure
		.input(SelectAlbumSchema.pick({ albumId: true }))
		.query(async (opts) => {
			const albumId: string = opts.input.albumId;

			// Retrieve the value from Redis
			const cachedValue: RatingData = (await redis.get(
				albumId
			)) as RatingData;

			console.log(cachedValue);

			// Database Call
			const average = await getRatingAverage(albumId);

			// Set a key-value pair in Redis
			await redis.set(albumId, JSON.stringify(average));
			console.log(JSON.stringify(average));

			return average;
		}),

	// Get the overall mean average for All given albums
	getEveryAlbumAverage: publicProcedure
		.input(z.object({ albums: z.string().array() }))
		.query(async (opts) => {
			const albumIds: string[] = opts.input.albums;

			return getAllAlbumAverages(albumIds);
		}),
});
