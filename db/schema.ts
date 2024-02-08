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
	followers: many(followers),
}));

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

export const followers = mysqlTable(
	"followers",
	{
		userId: varchar("user_id", { length: 256 }).notNull(),
		followingId: varchar("following_id", { length: 256 }).notNull(),
	},
	(table) => ({
		pk_ratings: primaryKey({
			columns: [table.userId, table.followingId],
		}),
	})
);

export const userFollowRelation = relations(followers, ({ one }) => ({
	// Define the relationship between user_id and following_id
	user: one(profile, {
		fields: [followers.userId],
		references: [profile.userId],
	}),

	following: one(profile, {
		fields: [followers.followingId],
		references: [profile.userId],
	}),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
	profile: one(profile, {
		fields: [ratings.userId],
		references: [profile.userId],
	}),
}));
