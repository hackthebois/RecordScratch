import { relations } from "drizzle-orm";
import {
	pgEnum,
	pgTable,
	primaryKey,
	smallint,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	email: text("email").unique().notNull(),
	googleId: text("google_id").unique(),
});

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
});

export const sessionRelations = relations(sessions, ({ one }) => ({
	userId: one(users, {
		fields: [sessions.userId],
		references: [users.id],
		relationName: "userId",
	}),
}));

export const profile = pgTable("profile", {
	userId: text("user_id")
		.notNull()
		.primaryKey()
		.references(() => users.id),
	name: text("name").notNull(),
	handle: text("handle").notNull().unique(),
	imageUrl: text("image_url"),
	bio: text("bio"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const profileRelations = relations(profile, ({ one, many }) => ({
	user: one(users, {
		fields: [profile.userId],
		references: [users.id],
		relationName: "user",
	}),
	profile: many(ratings, {
		relationName: "profile",
	}),
	follower: many(followers, {
		relationName: "follower",
	}),
	following: many(followers, {
		relationName: "following",
	}),
}));

export const categoryEnum = pgEnum("category", ["ALBUM", "SONG", "ARTIST"]);

export const ratings = pgTable(
	"ratings",
	{
		parentId: text("parent_id").notNull(),
		resourceId: text("resource_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id),
		rating: smallint("rating").notNull(),
		content: text("content"),
		category: categoryEnum("category").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
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
		relationName: "profile",
	}),
}));

export const followers = pgTable(
	"followers",
	{
		userId: text("user_id")
			.notNull()
			.references(() => users.id),
		followingId: text("following_id")
			.notNull()
			.references(() => users.id),
	},
	(table) => ({
		pk_ratings: primaryKey({
			columns: [table.userId, table.followingId],
		}),
	})
);

export const userFollowRelation = relations(followers, ({ one }) => ({
	// Define the relationship between user_id and following_id
	follower: one(profile, {
		fields: [followers.userId],
		references: [profile.userId],
		relationName: "follower",
	}),
	following: one(profile, {
		fields: [followers.followingId],
		references: [profile.userId],
		relationName: "following",
	}),
}));
