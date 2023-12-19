"use server";

import { AppRouter } from "@/server/_app";
import { inferRouterInputs } from "@trpc/server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { serverTrpc } from "./_trpc/server";

export type RouterInput = inferRouterInputs<AppRouter>;

export const rateAction = async (
	input: RouterInput["user"]["rating"]["rate"]
) => {
	await serverTrpc.user.rating.rate(input);
	revalidateTag(input.resourceId);
};

export const reviewAction = async (
	input: RouterInput["user"]["rating"]["review"]
) => {
	await serverTrpc.user.rating.review(input);
	revalidateTag(input.resourceId);
};

export const createProfile = async (
	input: RouterInput["user"]["profile"]["create"]
) => {
	await serverTrpc.user.profile.create(input);
};

export const updateProfile = async (
	input: RouterInput["user"]["profile"]["update"],
	userId: string,
	oldHandle?: string
) => {
	await serverTrpc.user.profile.update(input);
	if (oldHandle) revalidateTag(oldHandle);
	revalidateTag(input.handle);
	revalidateTag(userId);
	redirect(`/${input.handle}`);
};

export const handleExists = async (handle: string) => {
	return await serverTrpc.user.profile.handleExists(handle);
};

export const revalidateUser = async (userId: string) => {
	revalidateTag(userId);
};
