import { ratings } from "@/server/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { Profile } from "./profile";
import { SpotifyAlbum } from "./spotify";

export const ResourceRatingSchema = z.object({
	average: z.string().nullable(),
	total: z.number(),
});
export type ResourceRating = z.infer<typeof ResourceRatingSchema>;

export const RatingSchema = createSelectSchema(ratings, {
	content: z.string().min(1).max(10000),
});
export type Rating = z.infer<typeof RatingSchema>;

export const ResourceSchema = RatingSchema.pick({
	resourceId: true,
	category: true,
});
export type Resource = z.infer<typeof ResourceSchema>;

export const RateFormSchema = RatingSchema.pick({
	resourceId: true,
	category: true,
	rating: true,
});
export type RateForm = z.infer<typeof RateFormSchema>;

export const ReviewFormSchema = RatingSchema.pick({
	resourceId: true,
	category: true,
	content: true,
	rating: true,
});
export type ReviewForm = z.infer<typeof ReviewFormSchema>;

export const CategorySchema = RatingSchema.pick({
	category: true,
});
export type CategoryType = z.infer<typeof CategorySchema>;

export type Review = {
	rating: Rating;
	profile: Profile;
	album: SpotifyAlbum;
	name: string;
};
