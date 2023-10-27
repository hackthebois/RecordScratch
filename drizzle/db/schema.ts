import {
	mysqlEnum,
	mysqlTable,
	primaryKey,
	text,
	tinyint,
	varchar,
} from "drizzle-orm/mysql-core";
import { createSelectSchema } from "drizzle-zod";
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
		title: text("title"),
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

export const UserRatingDTO = createSelectSchema(ratings);
export type UserRating = z.infer<typeof UserRatingDTO>;

export const SelectRatingDTO = z.object({
	resourceId: z.string(),
	category: z.enum([RatingCategory.ALBUM, RatingCategory.SONG]),
});
export type SelectRatingType = z.infer<typeof SelectRatingDTO> & {
	userId: string;
};

export const UpdateUserRatingDTO = UserRatingDTO.omit({ userId: true });
export type UpdateUserRating = z.infer<typeof UpdateUserRatingDTO>;
