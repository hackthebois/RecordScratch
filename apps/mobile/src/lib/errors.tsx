import * as Sentry from "@sentry/react-native";
import { useEffect } from "react";
import env from "../env";

export const catchError = (error: any) => {
	console.error("Error: ", error);
	if (env.ENV !== "development") Sentry.captureException(error);
};

export const useCatchError = (error: any) => {
	useEffect(() => {
		catchError(error);
	}, [error]);
};
