import { getImageUrl } from "@/lib/image";
import { api } from "@/trpc/react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/AlertDialog";
import { buttonVariants } from "../ui/Button";
import { UserAvatar } from "./UserAvatar";
import { useEffect } from "react";

export const UserButton = () => {
	const navigate = useNavigate();
	const [profile] = api.profiles.me.useSuspenseQuery();
	const { data: needsOnboarding } = api.profiles.needsOnboarding.useQuery();

	useEffect(() => {
		if (needsOnboarding) {
			navigate({ to: "/onboard" });
		}
	}, [needsOnboarding, navigate]);

	if (!profile) {
		if (navigator.userAgent.includes("Instagram")) {
			return (
				<AlertDialog>
					<AlertDialogTrigger className={buttonVariants({})}>
						Sign In
					</AlertDialogTrigger>
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
		return (
			<a href="/auth/google" className={buttonVariants({})}>
				Sign In
			</a>
		);
	}

	return (
		<Link
			to="/$handle"
			params={{
				handle: String(profile.handle),
			}}
		>
			<UserAvatar
				imageUrl={getImageUrl(profile)}
				className="h-10 w-10 border border-muted"
			/>
		</Link>
	);
};

export default UserButton;
