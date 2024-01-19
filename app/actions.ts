"use server";

import { AppRouter } from "@/server/api/_app";
import { inferRouterInputs } from "@trpc/server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { serverTrpc } from "../trpc/server";

export type RouterInput = inferRouterInputs<AppRouter>;

export const rateAction = async (
	input: RouterInput["user"]["rating"]["rate"]
) => {
	await serverTrpc.user.rating.rate.mutate(input);
	revalidateTag(input.resourceId);
};

export const deleteRatingAction = async (
	input: RouterInput["user"]["rating"]["delete"]
) => {
	await serverTrpc.user.rating.delete.mutate(input);
	revalidateTag(input.resourceId);
};

export const reviewAction = async (
	input: RouterInput["user"]["rating"]["review"]
) => {
	await serverTrpc.user.rating.review.mutate(input);
	revalidateTag(input.resourceId);
};

export const createProfile = async (
	input: RouterInput["user"]["profile"]["create"]
) => {
	await serverTrpc.user.profile.create.mutate(input);
};

export const updateProfile = async (
	input: RouterInput["user"]["profile"]["update"],
	userId: string,
	oldHandle?: string
) => {
	await serverTrpc.user.profile.update.mutate(input);
	if (oldHandle) revalidateTag(oldHandle);
	revalidateTag(input.handle);
	revalidateTag(userId);
	redirect(`/${input.handle}`);
};

export const handleExists = async (handle: string) => {
	return await serverTrpc.user.profile.handleExists.query(handle);
};

export const revalidateUser = async (userId: string) => {
	revalidateTag(userId);
};
