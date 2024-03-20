import { relations } from "drizzle-orm";
import {
	boolean,
	int,
	mysqlEnum,
	mysqlTable,
	primaryKey,
	smallint,
	text,
	timestamp,
	varchar
} from "drizzle-orm/mysql-core";
import { generateId } from "lucia";
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

export const lists = mysqlTable("lists", {
	id: varchar("id", { length: 256 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 256 }).notNull(),
	name: varchar("name", { length: 50 }).notNull(),
	description: text("description"),
	category: mysqlEnum("category", ["ALBUM", "SONG", "ARTIST"]).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const listRelation = relations(lists, ({ one, many }) => ({
	profile: one(profile, {
		fields: [lists.userId],
		references: [profile.userId],
	}),
	resources: many(listResources),
}));

export const listResources = mysqlTable(
	"list_resources",
	{
		parentId: varchar("parent_id", { length: 256 }),
		listId: varchar("list_id", { length: 256 }).notNull(),
		resourceId: varchar("resource_id", { length: 256 }).notNull(),
		position: int("position").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
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

export const likes = mysqlTable("likes", {
	id: varchar("id", { length: 256 })
		.primaryKey()
		.$default(() => generateId(15)),
	userId: varchar("user_id", { length: 256 }).notNull(),
	resourceId: varchar("resource_id", { length: 256 }).notNull(),
	authorId: varchar("author_id", { length: 256 }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const likesRelations = relations(likes, ({ one }) => ({
	rating: one(ratings, {
		fields: [likes.resourceId, likes.authorId],
		references: [ratings.resourceId, ratings.userId],
	}),
}));

export const notifications = mysqlTable(
	"notifications",
	{
		id: varchar("id", { length: 15 })
			.primaryKey()
			.$default(() => generateId(15)),
		userId: varchar("user_id", { length: 15 }).notNull(),
		resourceId: varchar("resource_id", { length: 100 }),
		fromId: varchar("from_id", { length: 15 }).notNull(),
		type: mysqlEnum("type", ["LIKE", "FOLLOW"]).notNull(),
		seen: boolean("seen").default(false).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
	}
	// (table) => ({
	// 	unq: unique().on(
	// 		table.userId,
	// 		table.resourceId,
	// 		table.fromId,
	// 		table.type
	// 	),
	// })
);

export const notificationRelations = relations(notifications, ({ one }) => ({
	profile: one(profile, {
		fields: [notifications.fromId],
		references: [profile.userId],
	}),
	from: one(profile, {
		fields: [notifications.fromId],
		references: [profile.userId],
	}),
	rating: one(ratings, {
		fields: [notifications.resourceId],
		references: [ratings.resourceId],
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
	notifications,
};

export const relationSchemas = {
	sessionRelations,
	profileRelations,
	ratingsRelations,
	userFollowRelation,
	listRelation,
	listResourcesRelations,
	likesRelations,
	notificationRelations,
};
