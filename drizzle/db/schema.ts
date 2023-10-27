import {
	mysqlEnum,
	mysqlTable,
	primaryKey,
	text,
	tinyint,
	varchar,
} from "drizzle-orm/mysql-core";

export const ratings = mysqlTable(
	"ratings",
	{
		userId: varchar("user_id", { length: 256 }).notNull(),
		resourceId: varchar("resource_id", { length: 256 }).notNull(),
		rating: tinyint("rating").notNull(),
		description: text("description"),
		title: text("title"),
		category: mysqlEnum("category", ["ALBUM", "SONG"]).notNull(),
	},
	(table) => {
		return {
			pk_ratings: primaryKey(table.userId, table.resourceId),
		};
	}
);
