import {
	mysqlEnum,
	mysqlTable,
	primaryKey,
	text,
	tinyint,
	varchar,
} from "drizzle-orm/mysql-core";
import { z } from "zod";

export enum RatingCategory {
	ALBUM = "ALBUM",
	SONG = "SONG",
}

export const ratings = mysqlTable(
	"ratings",
	{
		userId: varchar("user_id", { length: 256 }).notNull(),
		resourceId: varchar("resource_id", { length: 256 }).notNull(),
		rating: tinyint("rating").notNull(),
		description: text("description"),
		category: mysqlEnum("category", [
			RatingCategory.ALBUM,
			RatingCategory.SONG,
		]).notNull(),
	},
	(table) => {
		return {
			pk_ratings: primaryKey(table.userId, table.resourceId),
		};
	}
);

/******************************
  Rating Type
 ******************************/
export type Rating = {
	ratingAverage: number;
	totalRatings: number;
};

export const UserRatingDTO = z.object({
	resourceId: z.string(),
	category: z.enum([RatingCategory.ALBUM, RatingCategory.SONG]),
	rating: z.number(),
	description: z.string(),
	userId: z.string(),
});
export type UserRating = z.infer<typeof UserRatingDTO>;

export const SelectRatingDTO = z.object({
	resourceId: z.string(),
	category: z.enum([RatingCategory.ALBUM, RatingCategory.SONG]),
});
export type SelectRatingType = Omit<
	z.infer<typeof UserRatingDTO>,
	"rating" | "description"
>;

export const UpdateUserRatingDTO = UserRatingDTO.omit({ userId: true });
export type UpdateUserRating = z.infer<typeof UpdateUserRatingDTO>;
