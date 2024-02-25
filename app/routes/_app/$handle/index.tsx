import { EditProfile } from "@/components/EditProfile";
import FollowerMenu from "@/components/FollowersMenu";
import { InfiniteProfileReviews } from "@/components/InfiniteProfileReviews";
import { useTheme } from "@/components/ThemeProvider";
import { UserAvatar } from "@/components/UserAvatar";
import { ErrorComponent } from "@/components/router/ErrorComponent";
import { PendingComponent } from "@/components/router/Pending";
import { Button } from "@/components/ui/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Label } from "@/components/ui/Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { api, apiUtils } from "@/trpc/react";
import { cn } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
	Link,
	createFileRoute,
	notFound,
	useNavigate,
} from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_app/$handle/")({
	component: Handle,
	pendingComponent: PendingComponent,
	errorComponent: ErrorComponent,
	validateSearch: (search) => {
		return z
			.object({
				rating: z.number().optional(),
				tab: z.enum(["settings"]).optional(),
				category: z.enum(["ALBUM", "SONG"]).optional(),
			})
			.parse(search);
	},
	loader: async ({ params: { handle } }) => {
		const profile = await apiUtils.profiles.get.ensureData(handle);
		if (!profile) throw notFound({ route: "/_app" });
		apiUtils.profiles.distribution.ensureData(profile.userId);
		apiUtils.profiles.followCount.ensureData({
			profileId: profile.userId,
			type: "followers",
		});
		apiUtils.profiles.followCount.ensureData({
			profileId: profile.userId,
			type: "following",
		});
	},
});

const SignOutButton = () => {
	const navigate = useNavigate({
		from: Route.fullPath,
	});
	const queryClient = useQueryClient();

	return (
		<Button
			variant="outline"
			onClick={() => {
				fetch("/auth/signout").then(() => {
					navigate({
						to: "/$handle",
						search: {
							tab: undefined,
						},
					});
					queryClient.clear();
				});
			}}
		>
			Sign out
		</Button>
	);
};

const ThemeToggle = () => {
	const { theme, setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>
					{theme && theme?.charAt(0).toUpperCase() + theme?.slice(1)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

function Handle() {
	const { handle } = Route.useParams();
	const { rating, tab = "reviews", category = "all" } = Route.useSearch();
	const { data: myProfile } = api.profiles.me.useQuery();

	const navigate = useNavigate({
		from: Route.fullPath,
	});
	const [profile] = api.profiles.get.useSuspenseQuery(handle);
	const [distribution] = api.profiles.distribution.useSuspenseQuery(
		profile?.userId || ""
	);

	if (!profile) return null;

	let max: number = Math.max(...distribution);
	max = max === 0 ? 1 : max;

	const isUser = myProfile?.userId === profile.userId;

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
				<UserAvatar
					{...profile}
					imageUrl={profile.imageUrl}
					size={160}
				/>
				<div className="flex flex-col items-center sm:items-start">
					<p className="pb-4 text-sm tracking-widest text-muted-foreground">
						PROFILE
					</p>
					<h1 className="pb-2 text-center sm:text-left">
						{profile.name}
					</h1>
					<p className="pb-3 text-center text-muted-foreground">
						@{profile.handle}
					</p>
					<p className="pb-3 text-center text-sm sm:text-left sm:text-base">
						{profile.bio || "No bio yet"}
					</p>
					<FollowerMenu profileId={profile.userId} />
				</div>
			</div>
			<Tabs value={tab}>
				<TabsList>
					{/* <TabsTrigger
						value="profile"
						onClick={() =>
							navigate({
								search: {
									tab: undefined,
								},
							})
						}
					>
						Profile
					</TabsTrigger> */}
					<TabsTrigger
						value="reviews"
						onClick={() =>
							navigate({
								search: {
									tab: undefined,
								},
							})
						}
					>
						Reviews
					</TabsTrigger>
					{isUser && (
						<TabsTrigger
							value="settings"
							onClick={() =>
								navigate({
									search: {
										tab: "settings",
									},
								})
							}
						>
							Settings
						</TabsTrigger>
					)}
				</TabsList>
				{/* <TabsContent value="profile" className="flex flex-col gap-4">
					<h3 className="mt-4">Top Albums</h3>
					<AlbumList
						albums={[
							"60322892",
							"1440807",
							"542677642",
							"44730061",
							"6982611",
							"107638",
						]}
					/>
					<ArtistList
						direction="vertical"
						artists={["1", "2", "3", "4", "5", "6"]}
					/>
				</TabsContent> */}
				<TabsContent value="reviews">
					<div className="flex w-full flex-col rounded-md border p-6 pt-6 sm:max-w-lg">
						<div className="flex h-20 w-full items-end justify-between gap-1">
							{distribution.map((ratings, index) => (
								<Link
									to="/$handle"
									params={{
										handle: handle,
									}}
									search={{
										rating: index + 1,
										category:
											category === "all"
												? undefined
												: category,
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
											rating === index + 1 &&
												"bg-orange-500"
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
					<Tabs value={category} className="mt-2">
						<TabsList>
							<TabsTrigger
								value="all"
								onClick={() =>
									navigate({
										search: (prev) => ({
											...prev,
											category: undefined,
										}),
									})
								}
							>
								All
							</TabsTrigger>
							<TabsTrigger
								value="ALBUM"
								onClick={() =>
									navigate({
										search: (prev) => ({
											...prev,
											category: "ALBUM",
										}),
									})
								}
							>
								Album
							</TabsTrigger>
							<TabsTrigger
								value="SONG"
								onClick={() =>
									navigate({
										search: (prev) => ({
											...prev,
											category: "SONG",
										}),
									})
								}
							>
								Song
							</TabsTrigger>
						</TabsList>
					</Tabs>
					<InfiniteProfileReviews
						input={{
							profileId: profile.userId,
							rating,
							category: category === "all" ? undefined : category,
						}}
						pageLimit={20}
					/>
				</TabsContent>
				{isUser && (
					<TabsContent value="settings">
						<div className="flex flex-col gap-8 py-6">
							<h3>Appearence</h3>
							<div className="flex items-center justify-between">
								<div className="flex flex-col items-start gap-2">
									<Label>Theme</Label>
									<p className="text-sm text-muted-foreground">
										Select a theme for your interface
									</p>
								</div>
								<ThemeToggle />
							</div>
							<h3>Account</h3>
							<div className="flex items-center justify-between">
								<div className="flex flex-col items-start gap-2">
									<Label>Edit Profile</Label>
									<p className="text-sm text-muted-foreground">
										Update your profile information and
										image
									</p>
								</div>
								<EditProfile profile={profile} />
							</div>
							<SignOutButton />
						</div>
					</TabsContent>
				)}
			</Tabs>
		</div>
	);
}
