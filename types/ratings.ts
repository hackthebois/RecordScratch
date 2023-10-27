import { ratings } from "@/drizzle/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export type RatingCategory = "ALBUM" | "SONG";

export type Resource = {
	resourceId: string;
	category: RatingCategory;
};

export type Rating = {
	ratingAverage: number;
	totalRatings: number;
};

export const UserRatingDTO = createSelectSchema(ratings);
export type UserRating = z.infer<typeof UserRatingDTO>;

export const SelectRatingDTO = UserRatingDTO.pick({
	category: true,
	resourceId: true,
});
export type SelectRatingType = z.infer<typeof SelectRatingDTO> & {
	userId: string;
};

export const UpdateUserRatingDTO = UserRatingDTO.omit({ userId: true });
export type UpdateUserRating = z.infer<typeof UpdateUserRatingDTO>;
