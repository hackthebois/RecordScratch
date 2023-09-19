import { getRating, insertRating } from "@/drizzle/db/functions";
import { NewRatingSchema } from "@/drizzle/db/schema";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "./trpc";

export const ratingRouter = router({
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
