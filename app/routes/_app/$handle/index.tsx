import FollowerMenu from "@/components/FollowersMenu";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { api, apiUtils } from "@/trpc/react";
import { cn } from "@/utils/utils";
import { SignedIn, useClerk, useUser } from "@clerk/clerk-react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_app/$handle/")({
	component: Handle,
	pendingComponent: () => <></>,
	validateSearch: (search) => {
		return z
			.object({
				rating: z.number().optional(),
			})
			.parse(search);
	},
	loader: ({ params: { handle } }) => {
		apiUtils.profiles.get.ensureData(handle);
		apiUtils.profiles.distribution.ensureData(handle);
	},
});

const SignOutButton = () => {
	const utils = api.useUtils();
	const { signOut } = useClerk();
	const { user } = useUser();
	// const posthog = usePostHog();
	const navigate = useNavigate();

	return (
		<Button
			variant="outline"
			onClick={() => {
				signOut(() => {
					utils.profiles.me.invalidate();
					// posthog.reset();
					navigate({
						to: "/",
					});
				});
			}}
		>
			Sign out
		</Button>
	);
};

function Handle() {
	const { handle } = Route.useParams();
	const { rating } = Route.useSearch();
	const [profile] = api.profiles.get.useSuspenseQuery(handle);
	const [distribution] = api.profiles.distribution.useSuspenseQuery(handle);

	if (!profile) return null;

	let max: number = Math.max(...distribution);
	max = max === 0 ? 1 : max;

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
				<UserAvatar {...profile} size={160} />
				<div className="flex flex-col items-center sm:items-start">
					<p className="pb-4 text-sm tracking-widest text-muted-foreground">PROFILE</p>
					<h1 className="pb-2 text-center sm:text-left">{profile.name}</h1>
					<p className="pb-3 text-center text-muted-foreground">@{profile.handle}</p>
					<p className="pb-3 text-center text-sm sm:text-left sm:text-base">
						{profile.bio || "No bio yet"}
					</p>
					<FollowerMenu profileId={profile.userId} />
				</div>
			</div>
			<div className="flex flex-col gap-6">
				<div className="flex max-w-lg flex-col rounded-md border p-6 pt-6">
					<div className="flex h-20 w-full items-end justify-between gap-1">
						{distribution.map((ratings, index) => (
							<Link
								to="/$handle"
								params={{
									handle: handle,
								}}
								search={{
									rating: index + 1,
								}}
								className="flex h-full flex-1 flex-col-reverse"
								key={index}
							>
								<div
									style={{
										height: `${(ratings / max) * 100}%`,
									}}
									className={cn(
										"h-full min-h-0 w-full rounded-t bg-[#ffb703] hover:opacity-90",
										rating === index + 1 && "bg-orange-500"
									)}
								/>
							</Link>
						))}
					</div>
					<div className="flex w-full items-end gap-1 pt-1">
						{distribution.map((_, index) => (
							<p
								key={index + 1}
								className="flex-1 text-center text-sm text-muted-foreground"
							>
								{index + 1}
							</p>
						))}
					</div>
				</div>
			</div>
			<SignedIn>
				<div className="flex flex-col gap-8 pb-8">
					<h3>Account</h3>
					<div className="flex items-center justify-between">
						<div className="flex flex-col items-start gap-2">
							<Label>Edit Profile</Label>
							<p className="text-sm text-muted-foreground">
								Update your profile information and image
							</p>
						</div>
						{/* <EditProfile profile={profile} updateProfile={updateProfile} /> */}
					</div>
					<SignOutButton />
				</div>
			</SignedIn>
		</div>
	);
}
