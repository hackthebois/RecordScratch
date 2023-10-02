import {
	getAlbumRating,
	getAllAlbumAverages,
	getRatingAverage,
	insertAlbumRating,
	updateAlbumRating,
} from "@/drizzle/db/albumFuncs";
import { NewAlbumSchema, SelectAlbumSchema } from "@/drizzle/db/schema";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./trpc";

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
		.mutation(async (opts) => {
			const userId: string = opts.ctx.userId;
			const albumId: string = opts.input.albumId;

			const existingRating = await getAlbumRating({ albumId, userId });

			if (!existingRating)
				await insertAlbumRating({ ...opts.input, userId });
			else {
				await updateAlbumRating({ ...opts.input, userId });
			}

			return existingRating;
		}),

	// Gets the users rating for an album
	getUserRating: protectedProcedure
		.input(SelectAlbumSchema.pick({ albumId: true }))
		.query(async (opts) => {
			const userId: string = opts.ctx.userId;
			const albumId: string = opts.input.albumId;

			return await getAlbumRating({ albumId, userId });
		}),

	// Get the overall mean average for one album
	getAlbumAverage: publicProcedure
		.input(SelectAlbumSchema.pick({ albumId: true }))
		.query(async (opts) => {
			const albumId: string = opts.input.albumId;

			return getRatingAverage(albumId);
		}),

	// Get the overall mean average for All given albums
	getEveryAlbumAverage: publicProcedure
		.input(z.object({ albums: z.string().array() }))
		.query(async (opts) => {
			const albumIds: string[] = opts.input.albums;

			return getAllAlbumAverages(albumIds);
		}),
});
