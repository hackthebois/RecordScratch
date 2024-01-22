"use server";

import "server-only";

import { spotify } from "@/app/_api/spotify";
import { db } from "@/db/db";
import { profile, ratings } from "@/db/schema";
import { CreateProfile, UpdateProfile } from "@/types/profile";
import { RateForm, Resource, ReviewForm } from "@/types/rating";
import { auth, clerkClient } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export const reviewAction = async (input: ReviewForm) => {
	const { userId } = auth();

	if (!userId) throw new Error("Not logged in");

	await db
		.insert(ratings)
		.values({ ...input, userId })
		.onDuplicateKeyUpdate({
			set: { ...input, userId },
		});

	revalidateTag(input.resourceId);
};

export const rateAction = async (input: RateForm) => {
	const { userId } = auth();

	if (!userId) throw new Error("Not logged in");

	await db
		.insert(ratings)
		.values({ ...input, userId })
		.onDuplicateKeyUpdate({
			set: { ...input, userId },
		});
};

export const deleteRatingAction = async ({
	resourceId,
	category,
}: Resource) => {
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
};

export const createProfile = async (input: CreateProfile) => {
	const { userId } = auth();

	if (!userId) throw new Error("Not logged in");

	await db.insert(profile).values({ ...input, userId });
	await clerkClient.users.updateUser(userId, {
		publicMetadata: { onboarded: true },
	});
};

export const updateProfile = async (
	input: UpdateProfile,
	oldHandle?: string
) => {
	const { userId } = auth();

	if (!userId) throw new Error("Not logged in");

	await db.update(profile).set(input).where(eq(profile.userId, userId));
	if (oldHandle) revalidateTag(oldHandle);
	revalidateTag(userId);
	redirect(`/${input.handle}`);
};

export const handleExistsAction = async (handle: string) => {
	const exists = !!(await db.query.profile.findFirst({
		where: eq(profile.handle, handle),
	}));
	return exists ? true : false;
};

export const searchAction = async (query: string) => {
	return await spotify.search(query, ["album", "artist"], undefined, 4);
};

export const revalidateUser = async (userId: string) => {
	revalidateTag(userId);
};
