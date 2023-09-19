"use server";
import { insertRating, getRating } from "@/drizzle/db/functions";
import { NewRatingSchema } from "@/drizzle/db/schema";
import { router, protectedProcedure } from "./trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
	rateAlbum: protectedProcedure
		.input(NewRatingSchema.pick({ albumId: true, rating: true }))
		.mutation(async (opts) => {
			const userId: string = opts.ctx.userId;
			const albumId: string = opts.input.albumId;

			const ratingExists: boolean =
				(await getRating({ albumId, userId })) != null;

			if (!ratingExists) await insertRating({ ...opts.input, userId });
			else throw new TRPCError({ code: "CONFLICT" });
		}),
});
