import { tinyint, varchar, mysqlView, mysqlTable, QueryBuilder} from "drizzle-orm/mysql-core";

const qb = new QueryBuilder();

export const ratings = mysqlTable("ratings", {
  id: varchar("id", {length: 256}).primaryKey(),
  albumId: varchar("albumId", {length: 256}).notNull(),
  artistId: varchar("artistId",{length:256}).notNull(),
  rating: tinyint("rating").notNull()
});

export const ratingsView = mysqlView("rating_view").as(qb.select().from(ratings));