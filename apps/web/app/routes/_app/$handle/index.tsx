import { Head } from "@/components/Head";
import { ResourceItem } from "@/components/ResourceItem";
import { useTheme } from "@/components/ThemeProvider";
import { ArtistItem } from "@/components/artist/ArtistItem";
import FollowerMenu from "@/components/followers/FollowersMenu";
import { InfiniteProfileReviews } from "@/components/infinite/InfiniteProfileReviews";
import { CreateList } from "@/components/lists/CreateList";
import ListList from "@/components/lists/ListList";
import { EditProfile } from "@/components/profile/EditProfile";
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
import { NotFound } from "@/components/ui/NotFound";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { UserAvatar } from "@/components/user/UserAvatar";
import { getImageUrl } from "@/lib/image";
import { api, apiUtils } from "@/trpc/react";
import { cn } from "@recordscratch/lib";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { usePostHog } from "posthog-js/react";
import { z } from "zod";

export const Route = createFileRoute("/_app/$handle/")({
	component: Handle,
	pendingComponent: PendingComponent,
	errorComponent: ErrorComponent,
	validateSearch: (search) => {
		return z
			.object({
				rating: z.number().optional(),
				tab: z.enum(["settings", "lists", "reviews"]).optional(),
				category: z.enum(["ALBUM", "SONG"]).optional(),
				topCategory: z.enum(["ALBUM", "SONG", "ARTIST"]).optional(),
			})
			.parse(search);
	},
	loader: async ({ params: { handle } }) => {
		const profile = await apiUtils.profiles.get.ensureData(handle);
		if (!profile) return <NotFound />;

		apiUtils.profiles.followCount.ensureData({
			profileId: profile.userId,
			type: "followers",
		});
		apiUtils.profiles.followCount.ensureData({
			profileId: profile.userId,
			type: "following",
		});

		apiUtils.lists.getUser.ensureData({
			userId: profile.userId,
		});

		apiUtils.lists.getProfile.ensureData({
			userId: profile.userId,
		});
	},
});

const SignOutButton = () => {
	const navigate = useNavigate({
		from: Route.fullPath,
	});
	const posthog = usePostHog();
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
					posthog.reset();
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
	const {
		rating,
		tab = "reviews",
		category = "all",
		topCategory = "ALBUM",
	} = Route.useSearch();
	const { data: myProfile } = api.profiles.me.useQuery();

	const [profile] = api.profiles.get.useSuspenseQuery(handle);
	const { data: distribution } = api.profiles.distribution.useQuery(
		{
			userId: profile?.userId || "",
			category: category === "all" ? undefined : category,
		},
		{
			placeholderData: keepPreviousData,
		}
	);
	if (!profile) return <NotFound />;

	const [topLists] = api.lists.getProfile.useSuspenseQuery({
		userId: profile.userId,
	});

	const [lists] = api.lists.getUser.useSuspenseQuery({
		userId: profile.userId,
	});

	const isUser = myProfile?.userId === profile.userId;

	return (
		<div className="flex flex-col gap-6">
			<Head title={profile.name} description={profile.bio ?? undefined} />
			<div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
				<UserAvatar
					imageUrl={getImageUrl(profile)}
					className={"h-36 w-36 overflow-hidden rounded-full"}
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
			<h3 className="-mb-4">{profile.name}'s Top 6</h3>
			<Tabs value={topCategory}>
				<TabsList>
					<TabsTrigger value="ALBUM" asChild>
						<Link
							from={Route.fullPath}
							search={{
								topCategory: undefined,
								tab: tab,
							}}
						>
							Albums
						</Link>
					</TabsTrigger>
					<TabsTrigger value="SONG" asChild>
						<Link
							from={Route.fullPath}
							search={{
								topCategory: "SONG",
								tab: tab,
							}}
						>
							Songs
						</Link>
					</TabsTrigger>
					<TabsTrigger value="ARTIST" asChild>
						<Link
							from={Route.fullPath}
							search={{
								topCategory: "ARTIST",
								tab: tab,
							}}
						>
							Artists
						</Link>
					</TabsTrigger>
				</TabsList>
				<TabsContent value="ALBUM">
					{topLists?.album && (
						<div className="grid max-w-screen-md grid-cols-3 gap-3 sm:grid-cols-6">
							{topLists.album.resources.map((album) => (
								<div
									className="flex w-full flex-col"
									key={album.resourceId}
								>
									<ResourceItem
										resource={{
											parentId: album.parentId!,
											resourceId: album.resourceId,
											category:
												topLists.album?.category ??
												"ALBUM",
										}}
										direction="vertical"
										imageCss={"relative rounded -mb-3"}
										titleCss="font-medium text-sm text-center line-clamp-2"
										showArtist={false}
									/>
								</div>
							))}
						</div>
					)}
				</TabsContent>
				<TabsContent value="SONG">
					{topLists?.song && (
						<div className="grid max-w-screen-md grid-cols-3 gap-3 sm:grid-cols-6">
							{topLists.song.resources.map((song) => (
								<div
									className="flex w-full flex-col"
									key={song.resourceId}
								>
									<ResourceItem
										resource={{
											parentId: song.parentId!,
											resourceId: song.resourceId,
											category:
												topLists.song?.category ??
												"SONG",
										}}
										direction="vertical"
										imageCss={"relative rounded -mb-3"}
										titleCss="font-medium text-sm text-center line-clamp-2"
										showArtist={false}
									/>
								</div>
							))}
						</div>
					)}
				</TabsContent>
				<TabsContent value="ARTIST">
					{topLists?.artist && (
						<div className="grid max-w-screen-md grid-cols-3 gap-3 sm:grid-cols-6">
							{topLists.artist.resources.map((artist) => (
								<div
									className="flex w-full flex-col"
									key={artist.resourceId}
								>
									<ArtistItem
										artistId={artist.resourceId}
										direction="vertical"
										imageCss={"relative rounded-full -mb-3"}
										textCss="font-medium text-sm text-center line-clamp-2"
									/>
								</div>
							))}
						</div>
					)}
				</TabsContent>
			</Tabs>
			<Tabs value={tab}>
				<TabsList>
					<TabsTrigger value="reviews" asChild>
						<Link
							from={Route.fullPath}
							search={{
								tab: undefined,
								topCategory: topCategory,
							}}
						>
							Reviews
						</Link>
					</TabsTrigger>
					<TabsTrigger value="lists" asChild>
						<Link
							from={Route.fullPath}
							search={{
								tab: "lists",
								topCategory: topCategory,
							}}
						>
							Lists
						</Link>
					</TabsTrigger>
					{isUser && (
						<TabsTrigger value="settings" asChild>
							<Link
								from={Route.fullPath}
								search={{
									tab: "settings",
									topCategory: topCategory,
								}}
							>
								Settings
							</Link>
						</TabsTrigger>
					)}
				</TabsList>
				<TabsContent value="reviews">
					<div className="flex w-full flex-col rounded-md border p-4 pt-6 sm:max-w-lg">
						<div className="flex h-20 w-full items-end justify-between gap-1">
							{distribution?.map((ratings, index) => (
								<Link
									from={Route.fullPath}
									search={{
										rating:
											rating === index + 1
												? undefined
												: index + 1,
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
											height: `${(ratings / (Math.max(...distribution) === 0 ? 1 : Math.max(...distribution))) * 100}%`,
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
							{distribution?.map((_, index) => (
								<p
									key={index + 1}
									className="flex-1 text-center text-sm text-muted-foreground"
								>
									{index + 1}
								</p>
							))}
						</div>
						<Tabs value={category} className="mt-2 w-full">
							<TabsList className="sm:w-full">
								<TabsTrigger value="all" asChild>
									<Link
										from={Route.fullPath}
										search={(prev) => ({
											...prev,
											category: undefined,
										})}
									>
										All
									</Link>
								</TabsTrigger>
								<TabsTrigger value="ALBUM" asChild>
									<Link
										from={Route.fullPath}
										search={(prev) => ({
											...prev,
											category: "ALBUM",
										})}
									>
										Album
									</Link>
								</TabsTrigger>
								<TabsTrigger value="SONG" asChild>
									<Link
										from={Route.fullPath}
										search={(prev) => ({
											...prev,
											category: "SONG",
										})}
									>
										Song
									</Link>
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
					<InfiniteProfileReviews
						input={{
							profileId: profile.userId,
							rating,
							category: category === "all" ? undefined : category,
							limit: 20,
						}}
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
				<TabsContent value="lists" className="flex flex-col">
					<div className="flex items-start self-center sm:self-start">
						{isUser && <CreateList />}
					</div>
					<div className="mt-2">
						{lists && (
							<ListList
								lists={lists}
								showProfiles={false}
								type="wrap"
							/>
						)}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
