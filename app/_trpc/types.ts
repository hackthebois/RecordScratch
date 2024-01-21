import { AppRouter } from "@/server/api/root";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export type RouterInput = inferRouterInputs<AppRouter>;

export type RouterOutput = inferRouterOutputs<AppRouter>;
