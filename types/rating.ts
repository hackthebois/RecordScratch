import { ratings } from "@/server/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { Rat } from "lucide-react";
import { z } from "zod";

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

export const RateSchema = RatingSchema.pick({
	resourceId: true,
	category: true,
	rating: true,
});
export type Rate = z.infer<typeof RateSchema>;

export const ReviewSchema = RatingSchema.pick({
	resourceId: true,
	category: true,
	content: true,
	rating: true,
});
export type Review = z.infer<typeof ReviewSchema>;

export const CategorySchema = RatingSchema.pick({
	category: true,
});
export type CategoryType = z.infer<typeof CategorySchema>;
