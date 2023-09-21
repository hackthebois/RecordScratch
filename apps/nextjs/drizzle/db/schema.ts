import {
	tinyint,
	varchar,
	mysqlTable,
	primaryKey,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const album_ratings = mysqlTable(
	"album_ratings",
	{
		userId: varchar("userId", { length: 256 }).notNull(),
		albumId: varchar("albumId", { length: 256 }).notNull(),
		rating: tinyint("rating").notNull(),
	},
	(table) => {
		return {
			pk_ratings: primaryKey(table.userId, table.albumId),
		};
	}
);

export const song_ratings = mysqlTable(
	"song_ratings",
	{
		userId: varchar("userId", { length: 256 }).notNull(),
		songId: varchar("songId", { length: 256 }).notNull(),
		albumId: varchar("albumId", { length: 256 }).notNull(),
		rating: tinyint("rating").notNull(),
	},
	(table) => {
		return {
			pk_ratings: primaryKey(table.userId, table.songId),
		};
	}
);

/******************************
  Album Zod Schemas and Types
 ******************************/
export const NewAlbumSchema = createInsertSchema(album_ratings);
export type NewRating = z.infer<typeof NewAlbumSchema>;

export const SelectAlbumSchema = createSelectSchema(album_ratings).omit({
	rating: true,
});
export type AlbumRating = z.infer<typeof SelectAlbumSchema>;

/******************************
  Song Zod Schemas and Types
 ******************************/
export const NewSongSchema = createInsertSchema(song_ratings);
export type NewSongRating = z.infer<typeof NewSongSchema>;

export const SelectSongSchema = createSelectSchema(song_ratings).omit({
	rating: true,
});
export type SongRating = z.infer<typeof SelectSongSchema>;
