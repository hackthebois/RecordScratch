"use server";

import "server-only";

import { spotify } from "@/app/_api/spotify";
import { db } from "@/db/db";
import { followers, profile, ratings } from "@/db/schema";
import { CreateProfileSchema, UpdateProfileSchema } from "@/types/profile";
import {
	RateFormSchema,
	ResourceSchema,
	ReviewFormSchema,
} from "@/types/rating";
import { auth, clerkClient } from "@clerk/nextjs";
import { and, eq, sql } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const action = createSafeActionClient();

export const privateAction = createSafeActionClient({
	async middleware() {
		const { userId } = auth();
		if (!userId) throw new Error("Not logged in");
		return userId;
	},
});

export const reviewAction = action(ReviewFormSchema, async (input) => {
	const { userId } = auth();

	if (!userId) throw new Error("Not logged in");

	await db
		.insert(ratings)
		.values({ ...input, userId })
		.onDuplicateKeyUpdate({
			set: { ...input, userId },
		});

	revalidateTag(input.resourceId);
});

export const rateAction = action(RateFormSchema, async (input) => {
	const { userId } = auth();

	if (!userId) throw new Error("Not logged in");

	await db
		.insert(ratings)
		.values({ ...input, userId })
		.onDuplicateKeyUpdate({
			set: { ...input, userId },
		});
});

export const deleteRatingAction = action(
	ResourceSchema,
	async ({ resourceId, category }) => {
		const { userId } = auth();

		if (!userId) throw new Error("Not logged in");

		await db
			.delete(ratings)
			.where(
				and(
					eq(ratings.userId, userId),
					eq(ratings.resourceId, resourceId),
					eq(ratings.category, category)
				)
			);
	}
);

export const createProfile = action(CreateProfileSchema, async (input) => {
	const { userId } = auth();

	if (!userId) throw new Error("Not logged in");

	await db.insert(profile).values({ ...input, userId });
	await clerkClient.users.updateUser(userId, {
		publicMetadata: { onboarded: true },
	});
});

export const updateProfile = action(
	z.object({
		...UpdateProfileSchema.shape,
		oldHandle: z.string().optional(),
	}),
	async ({ oldHandle, ...newProfile }) => {
		const { userId } = auth();

		if (!userId) throw new Error("Not logged in");

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

export const followUser = privateAction(
	z.string(),
	async (followingId, userId) => {
		if (!userId) throw new Error("Not logged in");

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
	}
);

export const followingCount = action(z.string(), async (userId) => {
	const userExists = !!(await db.query.profile.findFirst({
		where: eq(profile.userId, userId),
	}));

	if (!userExists) throw new Error("User Doesn't Exist");

	const count = await db
		.select({
			count: sql<number>`count(*)`.mapWith(Number),
		})
		.from(followers)
		.where(eq(followers.userId, userId));
	return count.length ? count[0].count : 0;
});

export const followersCount = action(z.string(), async (userId) => {
	const userExists = !!(await db.query.profile.findFirst({
		where: eq(profile.userId, userId),
	}));

	if (!userExists) throw new Error("User Doesn't Exist");

	const count = await db
		.select({
			count: sql<number>`count(*)`.mapWith(Number),
		})
		.from(followers)
		.where(eq(followers.followingId, userId));

	return count.length ? count[0].count : 0;
});

export const handleExistsAction = action(z.string(), async (handle) => {
	const exists = !!(await db.query.profile.findFirst({
		where: eq(profile.handle, handle),
	}));
	return exists ? true : false;
});

export const searchAction = action(z.string(), async (query) => {
	throw new Error("Not implemented");
	return await spotify.search(query, ["album", "artist"], undefined, 4);
});

export const revalidateUser = action(z.string(), async (userId) => {
	revalidateTag(userId);
});
