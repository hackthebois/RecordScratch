import {
	mysqlTable,
	primaryKey,
	text,
	tinyint,
	varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const album_ratings = mysqlTable(
	"album_ratings",
	{
		userId: varchar("userId", { length: 256 }).notNull(),
		albumId: varchar("albumId", { length: 256 }).notNull(),
		rating: tinyint("rating").notNull(),
		description: text("description").notNull(),
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
export const AlbumSchema = createInsertSchema(album_ratings);
export type AlbumRating = z.infer<typeof AlbumSchema>;

export const SelectAlbumSchema = createSelectSchema(album_ratings).omit({
	rating: true,
});
export type SelectAlbumRating = z.infer<typeof SelectAlbumSchema>;

/******************************
  Song Zod Schemas and Types
 ******************************/
export const SongSchema = createInsertSchema(song_ratings);
export type SongRating = z.infer<typeof SongSchema>;

export const SelectSongSchema = createSelectSchema(song_ratings).omit({
	rating: true,
});
export type SelectSongRating = z.infer<typeof SelectSongSchema>;
