import { ratings } from "@/drizzle/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export type RatingCategory = "ALBUM" | "SONG";

export const ResourceSchema = z.object({
	resourceId: z.string(),
	category: z.enum(["ALBUM", "SONG"]),
});
export type Resource = z.infer<typeof ResourceSchema>;

export const ResourceRatingSchema = z.object({
	average: z.string().nullable(),
	total: z.number(),
});
export type ResourceRating = z.infer<typeof ResourceRatingSchema>;

export const RatingSchema = createSelectSchema(ratings);
export type Rating = z.infer<typeof RatingSchema>;
