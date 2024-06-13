import { ratings } from "@recordscratch/db";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import type { Profile } from "./profile";

export const ResourceRatingSchema = z.object({
	resourceId: z.string(),
	average: z.string().nullable(),
	total: z.number(),
});
export type ResourceRating = z.infer<typeof ResourceRatingSchema>;

export const RatingSchema = createSelectSchema(ratings, {
	rating: z.number().min(1).max(10),
	content: z.string().min(1).max(10000),
});
export type Rating = z.infer<typeof RatingSchema>;

export const ResourceSchema = RatingSchema.pick({
	parentId: true,
	resourceId: true,
	category: true,
});
export type Resource = z.infer<typeof ResourceSchema>;

export const RateFormSchema = RatingSchema.pick({
	parentId: true,
	resourceId: true,
	category: true,
	rating: true,
}).extend({
	rating: RatingSchema.shape.rating.nullable(),
});
export type RateForm = z.infer<typeof RateFormSchema>;

export const ReviewFormSchema = RatingSchema.pick({
	parentId: true,
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

export type ReviewType = Rating & {
	profile: Profile;
};
