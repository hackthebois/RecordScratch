import {
	commentNotifications,
	comments,
	followers,
	followNotifications,
	getDB,
	likeNotifications,
	profile,
	ratings,
	users as userTable,
} from "@recordscratch/db";
import {
	parseCommentNotification,
	parseFollowNotification,
	parseLikeNotification,
} from "@recordscratch/lib";
import type { CreateFollowNotification, CreateLikeNotification, User } from "@recordscratch/types";
import "dotenv/config"; // Ensures env vars are loaded first
import { and, eq, inArray } from "drizzle-orm";
import { Expo, type ExpoPushMessage } from "expo-server-sdk";

export const sendPushNotifications = async ({
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

export const createCommentNotification = async (commentId: string) => {
	const db = getDB();

	const comment = await db.query.comments.findFirst({
		where: eq(comments.id, commentId),
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
			profile: {
				with: { user: true },
			},
			author: {
				with: { user: true },
			},
		},
	});

	if (
		!comment
		// Don't send notifications if the reply is to yourself
		// comment.parent?.userId === comment.userId ||
		// Don't send notifications if the comment is to yourself
		// comment.author.userId === comment.userId
	)
		return;

	const type = comment.parent ? "REPLY" : "COMMENT";
	const messageReceiver = type === "REPLY" ? comment.parent!.profile.user : comment.author.user;
	const messageGiver = comment.profile;

	const message = parseCommentNotification({
		comment,
		profile: messageGiver,
	});

	await Promise.all([
		db.insert(commentNotifications).values({
			type,
			fromId: messageGiver.userId,
			userId: messageReceiver.id,
			commentId,
		}),
		sendPushNotifications({
			users: [messageReceiver],
			messages: [message],
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

	const { following, follower } = follow;

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
			users: [following.user],
			messages: [parseFollowNotification({ profile: follower })],
		}),
	]);
};

export const createLikeNotification = async (notification: CreateLikeNotification) => {
	// Don't send notifications if the user is liking their own rating
	// if (notification.userId === notification.fromId) return;

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

	const fromProfile = await db.query.profile.findFirst({
		where: eq(profile.userId, notification.fromId),
	});

	if (!rating || !fromProfile) return;

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
			users: [rating.profile.user],
			messages: [
				parseLikeNotification({
					rating,
					profile: fromProfile,
					handle: rating.profile.handle,
				}),
			],
		}),
	]);
};
