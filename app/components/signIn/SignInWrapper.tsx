import { env } from "@/env";
import React from "react";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/AlertDialog";

export const SignInWrapper = ({ children }: { children: React.ReactNode }) => {
	if (navigator.userAgent.includes("Instagram")) {
		return (
			<AlertDialog>
				<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogTitle>
						Instagram in app browser detected
					</AlertDialogTitle>
					<AlertDialogDescription>
						Please sign in from an external browser
					</AlertDialogDescription>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		);
	}
	return <a href={env.VITE_BASE_URL + "/auth/google"}>{children}</a>;
};
