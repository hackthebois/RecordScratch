import {
	getAllAlbumAverages,
	getRatingAverage,
	getUserAlbumRating,
	insertAlbumRating,
	updateAlbumRating,
	userAlbumRatingExists,
} from "@/drizzle/db/albumFuncs";
import {
	RatingCategory,
	SelectRatingDTO,
	UpdateUserRatingDTO,
	UserRatingDTO,
} from "@/drizzle/db/schema";
import {
	getAllSongAverages,
	getUserSongRating,
	insertSongRating,
	updateSongRating,
	userSongRatingExists,
} from "@/drizzle/db/songFuncs";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./trpc";

export const ratingRouter = router({
	// Input the user rating for an album
	rate: protectedProcedure
		.input(UpdateUserRatingDTO)
		.mutation(async ({ ctx: { userId }, input: userRating }) => {
			const { resourceId, rating, description, type } = userRating;
			const ratingExists =
				userRating.type == RatingCategory.ALBUM
					? await userAlbumRatingExists({
							resourceId,
							userId,
					  })
					: await userSongRatingExists({
							userId,
							resourceId,
					  });

			if (rating === null && ratingExists) {
				if (type == RatingCategory.ALBUM)
					await updateAlbumRating({ ...userRating, userId });
				else await updateSongRating({ ...userRating, userId });
			}

			if (!ratingExists) {
				if (type == RatingCategory.ALBUM)
					await insertAlbumRating({ ...userRating, userId });
				else await insertSongRating({ ...userRating, userId });
			} else {
				if (type == RatingCategory.ALBUM) {
					// await redis.del(resourceId);
					await updateAlbumRating({ ...userRating, userId });
				} else await updateSongRating({ ...userRating, userId });
			}
		}),

	// Gets the users rating for an album
	getUserRating: protectedProcedure
		.input(SelectRatingDTO)
		.output(UserRatingDTO.nullable())
		.query(async ({ ctx: { userId }, input: { resourceId, type } }) => {
			return type == RatingCategory.ALBUM
				? await getUserAlbumRating({ resourceId, userId })
				: await getUserSongRating({ resourceId, userId });
		}),

	// Get the overall mean average for one album
	getAverage: publicProcedure
		.input(SelectRatingDTO)
		.query(async ({ input: { resourceId, type } }) => {
			// Retrieve the value from Redis
			// const cachedValue: Rating = (await redis.get(resourceId)) as Rating;

			// if (cachedValue) return cachedValue;
			// else {
			// Database Call
			const average = await getRatingAverage(resourceId, type);

			// Set a key-value pair in Redis
			// await redis.set(resourceId, JSON.stringify(average));
			// await redis.expire(resourceId, 86400); // 24h experation

			return average;
			// }
		}),

	// Get the overall mean average for All given albums
	getEveryAlbumAverage: publicProcedure
		.input(z.object({ id: z.string(), albums: z.string().array() }))
		.query(async ({ input: { id, albums } }) => {
			// Retrieve the value from Redis
			// const cachedValue = (await redis.get(id)) as Rating;

			// if (cachedValue) {
			// 	return cachedValue;
			// } else {
			// Database Call
			const average = await getAllAlbumAverages(albums);

			// // Set a key-value pair in Redis
			// await redis.set(id, JSON.stringify(average));
			// await redis.expire(id, 60 * 5); // 5 mins experation

			return average;
			// }
		}),

	// Gets the mean average rating for a song
	getAllAverageSongRatings: publicProcedure
		.input(z.object({ songIds: z.string().array() }))
		.query(async ({ input: { songIds } }) => {
			return getAllSongAverages(songIds);
		}),

	invalidateResource: protectedProcedure
		.input(z.object({ resourceId: z.string() }))
		.mutation(async ({ input: { resourceId } }) => {
			// await redis.del(resourceId);
		}),
});
