import { NewSongSchema, SelectSongSchema } from "@/drizzle/db/schema";
import {
	getAllSongAverages,
	userRatingExists,
	insertSongRating,
	updateSongRating,
	getUserRating,
} from "@/drizzle/db/songFuncs";
import { protectedProcedure, publicProcedure, router } from "./trpc";

export const songRouter = router({
	// Input the user rating for a song
	rateSong: protectedProcedure
		.input(
			NewSongSchema.pick({ albumId: true, songId: true, rating: true })
		)
		.mutation(
			async ({ ctx: { userId }, input: { albumId, songId, rating } }) => {
				const existingRating = await userRatingExists({
					userId,
					songId,
					albumId,
				});

				if (!existingRating)
					await insertSongRating({ albumId, songId, userId, rating });
				else {
					await updateSongRating({ albumId, songId, userId, rating });
				}
			}
		),

	// Gets the users rating for a song
	getUserRating: protectedProcedure
		.input(SelectSongSchema.pick({ songId: true, albumId: true }))
		.query(async ({ ctx: { userId }, input: { albumId, songId } }) => {
			return await getUserRating({ songId, albumId, userId });
		}),

	// Gets the mean average rating for a song
	getAllAverageSongRatings: publicProcedure
		.input(SelectSongSchema.pick({ albumId: true }))
		.query(async ({ input: { albumId } }) => {
			return getAllSongAverages(albumId);
		}),
});
