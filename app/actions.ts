"use server";

import { AppRouter } from "@/server/_app";
import { inferRouterInputs } from "@trpc/server";
import { revalidateTag } from "next/cache";
import { serverTrpc } from "./_trpc/server";

export type RouterInput = inferRouterInputs<AppRouter>;

export const rateAction = async (
	input: RouterInput["user"]["rating"]["rate"]
) => {
	await serverTrpc.user.rating.rate(input);
	revalidateTag(`rating:${input.resourceId}`);
};
