"use server";

import "server-only";

import { spotify } from "@/app/_api/spotify";
import { db } from "@/db/db";
import { profile, ratings } from "@/db/schema";
import { CreateProfileSchema, UpdateProfileSchema } from "@/types/profile";
import {
	RateFormSchema,
	ResourceSchema,
	ReviewFormSchema,
} from "@/types/rating";
import { auth, clerkClient } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const action = createSafeActionClient();

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
