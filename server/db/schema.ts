import { relations } from "drizzle-orm";
import {
	mysqlEnum,
	mysqlTable,
	primaryKey,
	text,
	timestamp,
	tinyint,
	varchar,
} from "drizzle-orm/mysql-core";

export const profile = mysqlTable("profile", {
	userId: varchar("user_id", { length: 256 }).notNull().primaryKey(),
	name: varchar("name", { length: 50 }).notNull(),
	handle: varchar("handle", { length: 20 }).notNull().unique(),
	imageUrl: varchar("image_url", { length: 256 }),
	bio: varchar("bio", { length: 200 }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const profileRelations = relations(profile, ({ many }) => ({
	ratings: many(ratings),
}));

export const ratings = mysqlTable(
	"ratings",
	{
		resourceId: varchar("resource_id", { length: 256 }).notNull(),
		userId: varchar("user_id", { length: 256 }).notNull(),
		rating: tinyint("rating").notNull(),
		content: text("content"),
		category: mysqlEnum("category", [
			"ALBUM",
			"SONG",
			"PLAYLIST",
		]).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
	},
	(table) => ({
		pk_ratings: primaryKey({
			columns: [table.resourceId, table.userId],
		}),
	})
);

export const ratingsRelations = relations(ratings, ({ one }) => ({
	profile: one(profile, {
		fields: [ratings.userId],
		references: [profile.userId],
	}),
}));

export const playlists = mysqlTable("playlists", {
	playlistId: varchar("playlist_id", { length: 256 }).primaryKey(),
	userId: varchar("user_id", { length: 256 }).notNull(),
	name: varchar("name", { length: 50 }).notNull(),
	description: text("content"),
	category: mysqlEnum("category", ["ALBUM", "SONG", "ARTIST"]).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const playlist_tracks = mysqlTable(
	"playlist_tracks",
	{
		resourceId: varchar("resource_id", { length: 256 }).notNull(),
		playlistId: varchar("playlist_id", { length: 256 }).notNull(),
	},
	(table) => ({
		pk_tracks: primaryKey({
			columns: [table.resourceId, table.playlistId],
		}),
	})
);
