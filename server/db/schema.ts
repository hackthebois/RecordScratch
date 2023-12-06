import {
	mysqlEnum,
	mysqlTable,
	primaryKey,
	text,
	timestamp,
	tinyint,
	varchar,
} from "drizzle-orm/mysql-core";

export const ratings = mysqlTable(
	"ratings",
	{
		resourceId: varchar("resource_id", { length: 256 }).notNull(),
		userId: varchar("user_id", { length: 256 }).notNull(),
		rating: tinyint("rating").notNull(),
		content: text("content"),
		category: mysqlEnum("category", ["ALBUM", "SONG", "ARTIST"]).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
	},
	(table) => ({
		pk_ratings: primaryKey({
			columns: [table.resourceId, table.userId],
		}),
	})
);
