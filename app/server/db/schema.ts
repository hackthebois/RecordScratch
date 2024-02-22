import { relations } from "drizzle-orm";
import {
	datetime,
	mysqlEnum,
	mysqlTable,
	primaryKey,
	text,
	timestamp,
	tinyint,
	varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
	id: varchar("id", {
		length: 255,
	}).primaryKey(),
	email: varchar("email", {
		length: 100,
	})
		.unique()
		.notNull(),
	googleId: varchar("google_id", {
		length: 255,
	}).unique(),
});

export const sessions = mysqlTable("sessions", {
	id: varchar("id", {
		length: 255,
	}).primaryKey(),
	userId: varchar("user_id", {
		length: 255,
	}).notNull(),
	expiresAt: datetime("expires_at").notNull(),
});

export const sessionRelations = relations(sessions, ({ one }) => ({
	userId: one(users, {
		fields: [sessions.userId],
		references: [users.id],
		relationName: "userId",
	}),
}));

export const profile = mysqlTable("profile", {
	userId: varchar("user_id", { length: 256 }).notNull().primaryKey(),
	name: varchar("name", { length: 50 }).notNull(),
	handle: varchar("handle", { length: 20 }).notNull().unique(),
	imageUrl: varchar("image_url", { length: 256 }),
	bio: varchar("bio", { length: 200 }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
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

export const ratings = mysqlTable(
	"ratings",
	{
		parentId: varchar("parent_id", { length: 256 }).notNull(),
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

export const ratingsRelations = relations(ratings, ({ one }) => ({
	profile: one(profile, {
		fields: [ratings.userId],
		references: [profile.userId],
		relationName: "profile",
	}),
}));

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
