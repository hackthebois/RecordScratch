"use server";

import "server-only";

import { spotify } from "@/app/_api/spotify";
import { db } from "@/db/db";
import { followers, profile, ratings } from "@/db/schema";
import { CreateProfileSchema, UpdateProfileSchema } from "@/types/profile";
import { RateFormSchema, ReviewFormSchema } from "@/types/rating";
import { auth, clerkClient } from "@clerk/nextjs";
import { and, eq, like, or } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const action = createSafeActionClient();

export const protectedAction = createSafeActionClient({
	async middleware() {
		const { userId } = auth();
		if (!userId) throw new Error("Not logged in");
		return {
			userId,
		};
	},
});

export const reviewAction = protectedAction(
	ReviewFormSchema,
	async (input, { userId }) => {
		await db
			.insert(ratings)
			.values({ ...input, userId })
			.onDuplicateKeyUpdate({
				set: { ...input, userId },
			});
		revalidateTag(input.resourceId);
		revalidateTag(userId);
	}
);

export const rateAction = protectedAction(
	RateFormSchema,
	async ({ rating, resourceId, category }, { userId }) => {
		if (rating === null) {
			await db
				.delete(ratings)
				.where(
					and(
						eq(ratings.userId, userId),
						eq(ratings.resourceId, resourceId),
						eq(ratings.category, category)
					)
				);
		} else {
			await db
				.insert(ratings)
				.values({ rating, resourceId, category, userId })
				.onDuplicateKeyUpdate({
					set: { rating, resourceId, category, userId },
				});
		}
		revalidateTag(resourceId);
		revalidateTag(userId);
	}
);

export const createProfile = protectedAction(
	CreateProfileSchema,
	async (input, { userId }) => {
		await db.insert(profile).values({ ...input, userId });
		await clerkClient.users.updateUser(userId, {
			publicMetadata: { onboarded: true },
		});
	}
);

export const updateProfile = protectedAction(
	z.object({
		...UpdateProfileSchema.shape,
		oldHandle: z.string().optional(),
	}),
	async ({ oldHandle, ...newProfile }, { userId }) => {
		await db
			.update(profile)
			.set(newProfile)
			.where(eq(profile.userId, userId));
		if (oldHandle) revalidateTag(oldHandle);
		revalidateTag(userId);
		revalidateTag(newProfile.handle);
		redirect(`/${newProfile.handle}`);
	}
);

export const followUser = protectedAction(
	z.string(),
	async (followingId, { userId }) => {
		if (userId === followingId)
			throw new Error("User Cannot Follow Themselves");

		const followExists =
			(
				await db
					.select()
					.from(followers)
					.where(
						and(
							eq(followers.userId, userId),
							eq(followers.followingId, followingId)
						)
					)
			).length > 0;

		if (followExists) throw new Error("User Already Follows");
		else await db.insert(followers).values({ userId, followingId });

		revalidateTag(`getFollowCount:${followingId}:followers`);
		revalidateTag(`getFollowCount:${userId}:following`);
		revalidateTag(`isUserFollowing:${followingId}:${userId}`);
		revalidateTag(`getFollowProfiles:${followingId}:${userId}:followers`);
		revalidateTag(`getFollowProfiles:${userId}:${userId}:following`);
	}
);

export const unFollowUser = protectedAction(
	z.string(),
	async (followingId, { userId }) => {
		if (userId === followingId)
			throw new Error("User Cannot unFollow Themselves");

		const followExists =
			(
				await db
					.select()
					.from(followers)
					.where(
						and(
							eq(followers.userId, userId),
							eq(followers.followingId, followingId)
						)
					)
			).length > 0;

		if (!followExists) throw new Error("User Doesn't Follow");
		else
			await db
				.delete(followers)
				.where(
					and(
						eq(followers.userId, userId),
						eq(followers.followingId, followingId)
					)
				);

		revalidateTag(`getFollowCount:${followingId}:followers`);
		revalidateTag(`getFollowCount:${userId}:following`);
		revalidateTag(`isUserFollowing:${followingId}:${userId}`);
		revalidateTag(`getFollowProfiles:${followingId}:${userId}:followers`);
		revalidateTag(`getFollowProfiles:${userId}:${userId}:following`);
	}
);

export const handleExistsAction = action(z.string(), async (handle) => {
	const exists = !!(await db.query.profile.findFirst({
		where: eq(profile.handle, handle),
	}));
	return exists ? true : false;
});

export const searchMusicAction = action(z.string(), async (query) => {
	return await spotify({
		route: "/search",
		input: { q: query, limit: 4, type: "album,artist,track" },
	});
});

export const searchProfilesAction = action(z.string(), async (query) => {
	return await db.query.profile.findMany({
		where: or(
			like(profile.handle, `%${query}%`),
			like(profile.name, `%${query}%`)
		),
	});
});

export const revalidateTagAction = action(z.string(), async (tag) => {
	revalidateTag(tag);
});
