import { NewSongSchema, SelectSongSchema } from "@/drizzle/db/schema";
import {
	getAllSongAverages,
	getSongRating,
	insertSongRating,
	updateSongRating,
} from "@/drizzle/db/songFuncs";
import { protectedProcedure, publicProcedure, router } from "./trpc";

export const songRouter = router({
	// Input the user rating for a song
	rateSong: protectedProcedure
		.input(
			NewSongSchema.pick({ albumId: true, songId: true, rating: true })
		)
		.mutation(async (opts) => {
			const userId: string = opts.ctx.userId;
			const albumId: string = opts.input.albumId;
			const songId: string = opts.input.songId;

			const existingRating = await getSongRating({
				userId,
				songId,
				albumId,
			});

			if (!existingRating)
				await insertSongRating({ ...opts.input, userId });
			else {
				await updateSongRating({ ...opts.input, userId });
			}
		}),

	// Gets the users rating for a song
	getUserRating: protectedProcedure
		.input(SelectSongSchema.pick({ songId: true, albumId: true }))
		.query(async (opts) => {
			const albumId: string = opts.input.albumId;
			const songId: string = opts.input.songId;
			const userId: string = opts.ctx.userId;

			return await getSongRating({ songId, albumId, userId });
		}),

	// Gets the mean average rating for a song
	getAllAverageSongRatings: publicProcedure
		.input(SelectSongSchema.pick({ albumId: true }))
		.query(async (opts) => {
			const albumId: string = opts.input.albumId;

			return getAllSongAverages(albumId);
		}),
});
