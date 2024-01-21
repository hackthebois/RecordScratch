"use server";

import "server-only";

import { RouterInputs } from "@/server/api";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "./_trpc/server";

export const rateAction = async (
	input: RouterInputs["user"]["rating"]["rate"]
) => {
	await api.user.rating.rate.mutate(input);
	revalidateTag(input.resourceId);
};

export const deleteRatingAction = async (
	input: RouterInputs["user"]["rating"]["delete"]
) => {
	await api.user.rating.delete.mutate(input);
	revalidateTag(input.resourceId);
};

export const reviewAction = async (
	input: RouterInputs["user"]["rating"]["review"]
) => {
	await api.user.rating.review.mutate(input);
	revalidateTag(input.resourceId);
};

export const createProfile = async (
	input: RouterInputs["user"]["profile"]["create"]
) => {
	await api.user.profile.create.mutate(input);
};

export const updateProfile = async (
	input: RouterInputs["user"]["profile"]["update"],
	userId: string,
	oldHandle?: string
) => {
	await api.user.profile.update.mutate(input);
	if (oldHandle) revalidateTag(oldHandle);
	revalidateTag(input.handle);
	revalidateTag(userId);
	redirect(`/${input.handle}`);
};

export const handleExists = async (handle: string) => {
	return await api.user.profile.handleExists.query(handle);
};

export const revalidateUser = async (userId: string) => {
	revalidateTag(userId);
};
