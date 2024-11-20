import {
	commentNotifications,
	comments,
	followers,
	followNotifications,
	getDB,
	likeNotifications,
	ratings,
	users as userTable,
} from "@recordscratch/db";
import {
	type CreateCommentNotification,
	type CreateFollowNotification,
	type CreateLikeNotification,
	type User,
} from "@recordscratch/types";
import "dotenv/config"; // Ensures env vars are loaded first
import { and, eq, inArray } from "drizzle-orm";
import { Expo, type ExpoPushMessage } from "expo-server-sdk";

const sendPushNotifications = async ({
	users,
	messages,
}: {
	users: User[] | string[];
	messages: {
		title: ExpoPushMessage["title"];
		body: ExpoPushMessage["body"];
		data: ExpoPushMessage["data"];
	}[];
}) => {
	let expo = new Expo({
		accessToken: process.env.EXPO_ACCESS_TOKEN,
	});

	// If users is an array of user ids, fetch the users from the database
	let usersList: User[] = [];
	if (users.every((item) => typeof item === "string")) {
		const db = getDB();
		const u = await db.query.users.findMany({
			where: inArray(userTable.id, users),
		});
		usersList = u;
	} else {
		usersList = users;
	}

	// Filter users that have notifications enabled and have an expo push token
	const pushTokens = usersList
		.filter((user) => user.notificationsEnabled && user.expoPushToken)
		.map((user) => user.expoPushToken!);

	// Create the notifications
	let notifications: ExpoPushMessage[] = [];
	pushTokens.forEach((token) => {
		messages.forEach((message) => {
			notifications.push({
				to: token,
				sound: "default",
				...message,
				subtitle: message.title,
			});
		});
	});

	// Chunk the notifications
	let chunks = expo.chunkPushNotifications(notifications);
	let tickets = [];
	(async () => {
		for (let chunk of chunks) {
			try {
				let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
				console.log(ticketChunk);
				tickets.push(...ticketChunk);
			} catch (error) {
				console.error(error);
			}
		}
	})();
};

export const createCommentNotification = async (notification: CreateCommentNotification) => {
	const db = getDB();

	const comment = await db.query.comments.findFirst({
		where: eq(comments.id, notification.commentId),
		with: {
			parent: {
				with: {
					profile: {
						with: {
							user: true,
						},
					},
				},
			},
			author: {
				with: {
					user: true,
				},
			},
			profile: true,
			rating: true,
		},
	});

	if (!comment) return;

	const {
		profile: { name, handle },
		rating,
	} = comment;

	const user = notification.type === "REPLY" ? comment.parent!.profile.user : comment.author.user;
	const body =
		notification.type === "REPLY"
			? `${name} replied to your comment: ${comment.content}`
			: `${name} commented on your ${rating.content ? `review: ${rating.content}` : "rating"}`;

	await Promise.all([
		db.insert(commentNotifications).values(notification),
		sendPushNotifications({
			users: [user],
			messages: [
				{
					title: `New ${notification.type}!`,
					body,
					data: {
						url: `/${handle}/ratings/${rating?.resourceId}`,
					},
				},
			],
		}),
	]);
};

export const createFollowNotification = async (notification: CreateFollowNotification) => {
	const db = getDB();

	const follow = await db.query.followers.findFirst({
		where: and(
			eq(followers.userId, notification.fromId),
			eq(followers.followingId, notification.userId)
		),
		with: {
			following: {
				with: {
					user: true,
				},
			},
			follower: true,
		},
	});

	if (!follow) return;

	const {
		following: { user },
		follower: { name, handle },
	} = follow;

	await Promise.all([
		db
			.insert(followNotifications)
			.values(notification)
			.onConflictDoUpdate({
				target: [followNotifications.userId, followNotifications.fromId],
				set: {
					updatedAt: new Date(),
				},
			}),
		sendPushNotifications({
			users: [user],
			messages: [
				{
					title: "New Follower!",
					body: `${name} has started following you`,
					data: {
						url: `/${handle}`,
					},
				},
			],
		}),
	]);
};

export const createLikeNotification = async (notification: CreateLikeNotification) => {
	const db = getDB();

	const rating = await db.query.ratings.findFirst({
		where: and(
			eq(ratings.resourceId, notification.resourceId),
			eq(ratings.userId, notification.userId)
		),
		with: {
			profile: {
				with: {
					user: true,
				},
			},
		},
	});

	if (!rating) return;

	const {
		profile: { user, name, handle },
		content,
	} = rating;

	await Promise.all([
		db
			.insert(likeNotifications)
			.values(notification)
			.onConflictDoUpdate({
				target: [
					likeNotifications.userId,
					likeNotifications.fromId,
					likeNotifications.resourceId,
				],
				set: {
					updatedAt: new Date(),
				},
			}),
		sendPushNotifications({
			users: [user],
			messages: [
				{
					title: "New Like!",
					body: `${name} liked your ${content ? `review: ${content}` : "rating"}`,
					data: {
						url: `/${handle}/ratings/${notification.resourceId}`,
					},
				},
			],
		}),
	]);
};
