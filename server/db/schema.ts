import {
	index,
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
		resourceId: varchar("resource_id", { length: 256 }).notNull(),
		userId: varchar("user_id", { length: 256 }).notNull(),
		rating: tinyint("rating").notNull(),
		description: text("description"),
		title: text("title"),
		category: mysqlEnum("category", ["ALBUM", "SONG", "ARTIST"]).notNull(),
	},
	(table) => ({
		pk_ratings: primaryKey({ columns: [table.resourceId, table.userId] }),
		resourceIdx: index("resource_idx").on(table.resourceId),
	})
);
