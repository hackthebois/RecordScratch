"use server";

import "server-only";

import { RouterInputs } from "@/server/api";
import { Resource } from "@/types/rating";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { api, publicApi } from "./_trpc/server";

const invalidateResource = async (resource: Resource) => {
	await publicApi.resource.rating.get.revalidate(resource);
	await publicApi.resource.rating.getListAverage.revalidate([resource]);
};

export const reviewAction = async (
	input: RouterInputs["user"]["rating"]["review"]
) => {
	await api.user.rating.review.mutate(input);
	await api.user.rating.get.revalidate(input);
	await publicApi.resource.rating.get.revalidate(input);
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
	if (oldHandle) await api.user.profile.get.revalidate({ handle: oldHandle });
	await api.user.profile.get.revalidate({ handle: input.handle });
	redirect(`/${input.handle}`);
};

export const handleExists = async (handle: string) => {
	return await api.user.profile.handleExists.query(handle);
};

export const revalidateUser = async (userId: string) => {
	revalidateTag(userId);
};
