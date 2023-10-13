import {
	deleteUserRating,
	getAllUserRatings,
	getRatingAverage,
	getUserRating,
	insertRating,
	updateRating,
	userRatingExists,
} from "@/drizzle/db/ratingsUtils";
import {
	SelectRatingDTO,
	UpdateUserRatingDTO,
	UserRatingDTO,
} from "@/drizzle/db/schema";
import {
	getAllSongAverages,
	getAllUserSongRatings,
} from "@/drizzle/db/songUtils";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./trpc";
import { getAllAlbumAverages } from "@/drizzle/db/albumUtils";

export const ratingRouter = router({
	// Input the user rating for an album
	rate: protectedProcedure
		.input(UpdateUserRatingDTO)
		.mutation(async ({ ctx: { userId }, input: userRating }) => {
			const ratingExists = await userRatingExists({
				...userRating,
				userId,
			});

			if (ratingExists) await updateRating({ ...userRating, userId });
			else await insertRating({ ...userRating, userId });
		}),

	// Gets the users rating
	getUserRating: protectedProcedure
		.input(SelectRatingDTO)
		.query(async ({ ctx: { userId }, input: { resourceId } }) => {
			return await getUserRating({ resourceId, userId });
		}),

	// Delete user rating
	deleteUserRating: protectedProcedure
		.input(SelectRatingDTO)
		.query(async ({ ctx: { userId }, input: { resourceId } }) => {
			await deleteUserRating({ resourceId, userId });
		}),

	// Get the overall mean average for one album
	getAverage: publicProcedure
		.input(SelectRatingDTO)
		.query(async ({ input: { resourceId, category } }) => {
			return await getRatingAverage(resourceId, category);
		}),

	// Get the overall mean average of All given albums
	getEveryAlbumAverage: publicProcedure
		.input(z.object({ id: z.string(), albums: z.string().array() }))
		.query(async ({ input: { albums } }) => {
			return await getAllAlbumAverages(albums);
		}),

	// Gets the mean average rating for a song
	getAllAverageSongRatings: publicProcedure
		.input(z.object({ songIds: z.string().array() }))
		.query(async ({ input: { songIds } }) => {
			return getAllSongAverages(songIds);
		}),

	// Get the mean average for each individual song
	getAllUserSongRatings: protectedProcedure
		.input(z.object({ songIds: z.string().array() }))
		.output(z.array(UserRatingDTO).nullable())
		.query(async ({ ctx: { userId }, input: { songIds } }) => {
			return getAllUserSongRatings(songIds, userId);
		}),

	getEveryUserRating: protectedProcedure
		.input(SelectRatingDTO)
		.query(async ({ ctx: { userId }, input: { category } }) => {
			return await getAllUserRatings({ userId, category });
		}),
});
