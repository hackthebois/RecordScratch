import { ratings } from "@/server/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const ResourceRatingSchema = z.object({
	average: z.string().nullable(),
	total: z.number(),
});
export type ResourceRating = z.infer<typeof ResourceRatingSchema>;

export const RatingSchema = createSelectSchema(ratings);
export type Rating = z.infer<typeof RatingSchema>;

export const ResourceSchema = RatingSchema.pick({
	resourceId: true,
	category: true,
});
export type Resource = z.infer<typeof ResourceSchema>;
