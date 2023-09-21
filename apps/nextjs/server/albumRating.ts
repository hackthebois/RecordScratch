import {
	getRatingAverage,
	getRating,
	insertRating,
	getAllAlbumAverages,
} from "@/drizzle/db/albumFuncs";
import { NewAlbumSchema, SelectAlbumSchema } from "@/drizzle/db/schema";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "./trpc";
import { z } from "zod";

export const albumRouter = router({
	// Input the user rating for an album
	rateAlbum: protectedProcedure
		.input(NewAlbumSchema.pick({ albumId: true, rating: true }))
		.mutation(async (opts) => {
			const userId: string = opts.ctx.userId;
			const albumId: string = opts.input.albumId;

			const ratingExists: boolean =
				(await getRating({ albumId, userId })) != null;

			if (!ratingExists) await insertRating({ ...opts.input, userId });
			else throw new TRPCError({ code: "CONFLICT" });
		}),

	// Get the overall mean average for one album
	getAlbumAverage: publicProcedure
		.input(SelectAlbumSchema.pick({ albumId: true }))
		.mutation(async (opts) => {
			const albumId: string = opts.input.albumId;

			return getRatingAverage(albumId);
		}),

	// Get the overall mean average for All given albums
	getEveryAlbumAverage: publicProcedure
		.input(z.object({ albums: z.string().array() }))
		.mutation(async (opts) => {
			const albumIds: string[] = opts.input.albums;

			return getAllAlbumAverages(albumIds);
		}),
});
