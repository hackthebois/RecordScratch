import {
	tinyint,
	varchar,
	mysqlTable,
	primaryKey,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const ratings = mysqlTable(
	"ratings",
	{
		userId: varchar("id", { length: 256 }).notNull(),
		albumId: varchar("albumId", { length: 256 }).notNull(),
		rating: tinyint("rating").notNull(),
	},
	(table) => {
		return {
			pk_ratings: primaryKey(table.userId, table.albumId),
		};
	}
);

export const NewRatingSchema = createInsertSchema(ratings);
export type NewRating = z.infer<typeof NewRatingSchema>;

export const selectRatingSchema = createSelectSchema(ratings).omit({
	rating: true,
});
export type SelectRating = z.infer<typeof selectRatingSchema>;
