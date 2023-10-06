import { SongSchema, SelectSongSchema } from "@/drizzle/db/schema";
import {
	userSongRatingExists,
	insertSongRating,
	updateSongRating,
	getUserSongRating,
} from "@/drizzle/db/songFuncs";
import { protectedProcedure, publicProcedure, router } from "./trpc";

export const songRouter = router({
	// Input the user rating for a song
	// rateSong: protectedProcedure
	// 	.input(SongSchema.pick({ albumId: true, songId: true, rating: true }))
	// 	.mutation(
	// 		async ({ ctx: { userId }, input: { albumId, songId, rating } }) => {
	// 			const existingRating = await userSongRatingExists({
	// 				userId,
	// 				songId,
	// 				albumId,
	// 			});
	// 			if (!existingRating)
	// 				await insertSongRating({ albumId, songId, userId, rating });
	// 			else {
	// 				await updateSongRating({ albumId, songId, userId, rating });
	// 			}
	// 		}
	// 	),
	// Gets the users rating for a song
	// getUserRating: protectedProcedure
	// 	.input(SelectSongSchema.pick({ songId: true, albumId: true }))
	// 	.query(async ({ ctx: { userId }, input: { songId } }) => {
	// 		return await getUserSongRating({ songId, userId });
	// 	}),
	// Gets the mean average rating for a song
	// getAllAverageSongRatings: publicProcedure
	// 	.input(SelectSongSchema.pick({ albumId: true }))
	// 	.query(async ({ input: { albumId } }) => {
	// 		return getAllSongAverages(albumId);
	// 	}),
});
