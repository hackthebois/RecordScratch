"use server";

import "server-only";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "./_trpc/server";
import { RouterInput } from "./_trpc/types";

export const rateAction = async (
	input: RouterInput["user"]["rating"]["rate"]
) => {
	await api.user.rating.rate(input);
	revalidateTag(input.resourceId);
};

export const deleteRatingAction = async (
	input: RouterInput["user"]["rating"]["delete"]
) => {
	await api.user.rating.delete(input);
	revalidateTag(input.resourceId);
};

export const reviewAction = async (
	input: RouterInput["user"]["rating"]["review"]
) => {
	await api.user.rating.review(input);
	revalidateTag(input.resourceId);
};

export const createProfile = async (
	input: RouterInput["user"]["profile"]["create"]
) => {
	await api.user.profile.create(input);
};

export const updateProfile = async (
	input: RouterInput["user"]["profile"]["update"],
	userId: string,
	oldHandle?: string
) => {
	await api.user.profile.update(input);
	if (oldHandle) revalidateTag(oldHandle);
	revalidateTag(input.handle);
	revalidateTag(userId);
	redirect(`/${input.handle}`);
};

export const handleExists = async (handle: string) => {
	return await api.user.profile.handleExists(handle);
};

export const revalidateUser = async (userId: string) => {
	revalidateTag(userId);
};
