import { tinyint, varchar, mysqlTable, primaryKey} from "drizzle-orm/mysql-core";

export const ratings = mysqlTable("ratings", {
  userId: varchar("id", {length: 256}).notNull(),
  albumId: varchar("albumId", {length: 256}).notNull(),
  rating: tinyint("rating").notNull()
}, (table) => {
	return {
		pk_ratings: primaryKey(table.userId, table.albumId)
	}
}
);