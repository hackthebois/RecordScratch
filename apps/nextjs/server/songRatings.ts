import { NewSongSchema, SelectSongSchema } from "@/drizzle/db/schema";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "./trpc";
import {
	getAllSongAverages,
	getSongRating,
	insertSongRating,
} from "@/drizzle/db/songFuncs";

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

			const ratingExists: boolean =
				(await getSongRating({ userId, songId, albumId })) != null;

			if (!ratingExists)
				await insertSongRating({ ...opts.input, userId });
			else throw new TRPCError({ code: "CONFLICT" });
		}),
	getAllAverageSongRatings: publicProcedure
		.input(SelectSongSchema.pick({ albumId: true }))
		.mutation(async (opts) => {
			const albumId: string = opts.input.albumId;

			return getAllSongAverages(albumId);
		}),
});
