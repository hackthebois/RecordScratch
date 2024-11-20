import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	smallint,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

import { v4 as uuidv4 } from "uuid";

const dates = {
	createdAt: timestamp("created_at", {
		withTimezone: true,
	})
		.notNull()
		.$default(() => new Date()),
	updatedAt: timestamp("updated_at", {
		withTimezone: true,
	})
		.notNull()
		.$default(() => new Date()),
};

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	email: varchar("email", {
		length: 254,
	}),
	googleId: text("google_id").unique(),
	appleId: text("apple_id").unique(),
});

export const usersRelations = relations(users, ({ one }) => ({
	profile: one(profile, {
		fields: [users.id],
		references: [profile.userId],
	}),
}));

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull(),
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
	userId: text("user_id").notNull().primaryKey(),
	name: varchar("name", {
		length: 50,
	}).notNull(),
	imageUrl: text("image_url"),
	handle: varchar("handle", {
		length: 20,
	})
		.notNull()
		.unique(),
	bio: varchar("bio", {
		length: 200,
	}),
	...dates,
});

export const profileRelations = relations(profile, ({ one, many }) => ({
	user: one(users, {
		fields: [profile.userId],
		references: [users.id],
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
		userId: text("user_id").notNull(),
		rating: smallint("rating").notNull(),
		content: text("content"),
		category: categoryEnum("category").notNull(),
		...dates,
	},
	(table) => ({
		pk_ratings: primaryKey({
			columns: [table.resourceId, table.userId],
		}),
	})
);

export const ratingsRelations = relations(ratings, ({ one, many }) => ({
	profile: one(profile, {
		fields: [ratings.userId],
		references: [profile.userId],
		relationName: "profile",
	}),
	likes: many(likes),
}));

export const followers = pgTable(
	"followers",
	{
		userId: text("user_id").notNull(),
		followingId: text("following_id").notNull(),
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

export const lists = pgTable("lists", {
	id: text("id").primaryKey().notNull(),
	userId: text("user_id").notNull(),
	name: varchar("name", {
		length: 50,
	}).notNull(),
	description: text("description"),
	category: categoryEnum("category").notNull(),
	onProfile: boolean("on_profile").default(false).notNull(),
	...dates,
});

export const listRelation = relations(lists, ({ one, many }) => ({
	profile: one(profile, {
		fields: [lists.userId],
		references: [profile.userId],
	}),
	resources: many(listResources),
}));

export const listResources = pgTable(
	"list_resources",
	{
		parentId: text("parent_id"),
		listId: text("list_id").notNull(),
		resourceId: text("resource_id").notNull(),
		position: integer("position").notNull(),
		...dates,
	},
	(table) => ({
		pk_ratings: primaryKey({
			columns: [table.listId, table.resourceId],
		}),
	})
);

export const listResourcesRelations = relations(listResources, ({ one }) => ({
	list: one(lists, {
		fields: [listResources.listId],
		references: [lists.id],
	}),
}));

export const likes = pgTable("likes", {
	id: text("id")
		.primaryKey()
		.$default(() => uuidv4()),
	userId: text("user_id").notNull(),
	resourceId: text("resource_id").notNull(),
	authorId: text("author_id").notNull(),
	...dates,
});

export const likesRelations = relations(likes, ({ one }) => ({
	rating: one(ratings, {
		fields: [likes.resourceId, likes.authorId],
		references: [ratings.resourceId, ratings.userId],
	}),
}));

export const commentEnum = pgEnum("comment_type", ["COMMENT", "REPLY"]);
const notificationOutline = {
	userId: text("user_id").notNull(),
	fromId: text("from_id").notNull(),
	seen: boolean("seen").default(false).notNull(),
	...dates,
};

export const commentNotifications = pgTable("comment_notifications", {
	id: text("id")
		.primaryKey()
		.$default(() => uuidv4()),
	commentId: text("comment_id").notNull(),
	type: commentEnum("type").notNull(), // REMOVE: Moved to comments table
	...notificationOutline,
});

export const commentNotificationRelations = relations(commentNotifications, ({ one }) => ({
	profile: one(profile, {
		fields: [commentNotifications.fromId],
		references: [profile.userId],
	}),
	comment: one(comments, {
		fields: [commentNotifications.commentId],
		references: [comments.id],
	}),
}));

export const followNotifications = pgTable(
	"follow_notifications",
	{ ...notificationOutline },
	(table) => ({
		pk: primaryKey({
			columns: [table.fromId, table.userId],
		}),
	})
);

export const followNotificationRelations = relations(followNotifications, ({ one }) => ({
	profile: one(profile, {
		fields: [followNotifications.fromId],
		references: [profile.userId],
	}),
}));

export const likeNotifications = pgTable(
	"like_notifications",
	{
		resourceId: text("resource_id").notNull(),
		...notificationOutline,
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.fromId, table.userId, table.resourceId],
		}),
	})
);

export const likeNotificationRelations = relations(likeNotifications, ({ one }) => ({
	profile: one(profile, {
		fields: [likeNotifications.fromId],
		references: [profile.userId],
	}),
	rating: one(ratings, {
		fields: [likeNotifications.resourceId],
		references: [ratings.resourceId],
	}),
}));

export const comments = pgTable("comments", {
	id: text("id")
		.primaryKey()
		.notNull()
		.$default(() => uuidv4()),
	userId: text("user_id").notNull(), // The user who made the comment
	resourceId: text("resource_id").notNull(), // rating resourceId
	authorId: text("author_id").notNull(), // rating author
	parentId: text("parent_id"), // parent comment id (null if commenting to rating)
	rootId: text("root_id"), // root comment id (null if commenting to rating)
	content: text("content").notNull(),
	...dates,
});

export const commentsRelations = relations(comments, ({ one, many }) => ({
	rating: one(ratings, {
		fields: [comments.resourceId, comments.authorId],
		references: [ratings.resourceId, ratings.userId],
	}),
	profile: one(profile, {
		fields: [comments.userId],
		references: [profile.userId],
	}),
	author: one(profile, {
		fields: [comments.authorId],
		references: [profile.userId],
	}),
	parent: one(comments, {
		fields: [comments.parentId],
		references: [comments.id],
		relationName: "replies",
	}),
	replies: many(comments, {
		relationName: "replies",
	}),
}));

export const tableSchemas = {
	users,
	sessions,
	profile,
	ratings,
	followers,
	lists,
	listResources,
	likes,
	comments,
	commentNotifications,
	followNotifications,
	likeNotifications,
};

export const relationSchemas = {
	usersRelations,
	sessionRelations,
	profileRelations,
	ratingsRelations,
	userFollowRelation,
	listRelation,
	listResourcesRelations,
	likesRelations,
	commentsRelations,
	commentNotificationRelations,
	followNotificationRelations,
	likeNotificationRelations,
};
