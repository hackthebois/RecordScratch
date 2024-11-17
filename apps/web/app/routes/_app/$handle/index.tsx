/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "@/components/ThemeProvider";
import FollowerMenu from "@/components/followers/FollowersMenu";
import { CreateList } from "@/components/lists/CreateList";
import { EditTopLists } from "@/components/lists/EditTopLists";
import ListList from "@/components/lists/ListList";
import { ResourcesList } from "@/components/lists/TopLists";
import { EditProfile } from "@/components/profile/EditProfile";
import { ReviewsList } from "@/components/review/ReviewsList";
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
import { Tag } from "@/components/ui/Tag";
import { UserAvatar } from "@/components/user/UserAvatar";
import { getImageUrl } from "@/lib/image";
import { api, apiUtils } from "@/trpc/react";
import { cn } from "@recordscratch/lib/src/utils";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import {
	Link,
	createFileRoute,
	notFound,
	useNavigate,
	useRouteContext,
	useRouter,
} from "@tanstack/react-router";
import { Disc3, Loader2 } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { Suspense, useState } from "react";
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

		apiUtils.lists.topLists.ensureData({
			userId: profile.userId,
		});
	},
});

const TopListLoader = () => {
	return (
		<div className="mb-2 mt-5 flex h-[10rem] items-center justify-center">
			<Loader2 size={35} className="animate-spin" />
		</div>
	);
};

const SignOutButton = () => {
	const router = useRouter();
	const posthog = usePostHog();

	return (
		<Button
			variant="outline"
			onClick={() => {
				fetch("/api/auth/signout")
					.then(async () => {
						posthog.reset();
						await apiUtils.invalidate();
					})
					.then(() => {
						router.navigate({
							to: "/",
						});
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
	const { profile: myProfile } = useRouteContext({
		from: "__root__",
	});
	const {
		rating,
		tab = "reviews",
		category = "all",
		topCategory = "ALBUM",
	} = Route.useSearch();

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

	const [editMode, setEditMode] = useState<boolean>(false);
	const [hoverIndex, setHoverIndex] = useState(-1);

	if (!profile) return <NotFound />;

	const [topLists] = api.lists.topLists.useSuspenseQuery({
		userId: profile.userId,
	});

	const [lists] = api.lists.getUser.useSuspenseQuery({
		userId: profile.userId,
	});

	const [streak] = api.ratings.user.streak.useSuspenseQuery({
		userId: profile.userId,
	});
	const [total] = api.ratings.user.total.useSuspenseQuery({
		userId: profile.userId,
	});
	const [likes] = api.ratings.user.totalLikes.useSuspenseQuery({
		userId: profile.userId,
	});

	const isUser = myProfile?.userId === profile.userId;

	const tags = [
		`@${profile.handle}`,
		`Streak: ${streak}`,
		`Ratings: ${total}`,
		`Likes: ${likes}`,
	];

	return (
		<div className="flex flex-col gap-6">
			{/* <Seo
				title={profile.name}
				description={[
					...(profile.bio ? [profile.bio] : []),
					...tags,
				].join(", ")}
				imageUrl={getImageUrl(profile)}
				path={`/${profile.handle}`}
				keywords={tags.join(", ")}
			/> */}
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
					<div className="flex flex-wrap justify-center gap-3 pb-3 sm:justify-start">
						{tags
							.filter((tag) => Boolean(tag))
							.map((tag, index) => (
								<Tag variant="outline" key={index}>
									{tag}
								</Tag>
							))}
					</div>
					<p className="pb-3 text-center text-sm sm:text-left sm:text-base">
						{profile.bio || "No bio yet"}
					</p>
					<FollowerMenu profileId={profile.userId} />
				</div>
			</div>
			<div className="flex flex-row items-center justify-center gap-2 sm:justify-start">
				<h3 className="-mb-4">{profile.name}'s Top 6</h3>
				{isUser && (
					<EditTopLists
						editMode={editMode}
						onClick={() => {
							setEditMode(!editMode);
						}}
					/>
				)}
			</div>

			<Tabs value={topCategory}>
				<TabsList>
					<TabsTrigger value="ALBUM" asChild>
						<Link
							from={Route.fullPath}
							search={(prev: any) => ({
								...prev,
								topCategory: undefined,
							})}
						>
							Albums
						</Link>
					</TabsTrigger>
					<TabsTrigger value="SONG" asChild>
						<Link
							from={Route.fullPath}
							search={(prev: any) => ({
								...prev,
								topCategory: "SONG",
							})}
						>
							Songs
						</Link>
					</TabsTrigger>
					<TabsTrigger value="ARTIST" asChild>
						<Link
							from={Route.fullPath}
							search={(prev: any) => ({
								...prev,
								topCategory: "ARTIST",
							})}
						>
							Artists
						</Link>
					</TabsTrigger>
				</TabsList>
				<TabsContent value="ALBUM">
					<Suspense fallback={<TopListLoader />}>
						<ResourcesList
							category="ALBUM"
							editMode={editMode}
							userId={profile.userId}
							isUser={isUser}
							list={topLists?.album}
						/>
					</Suspense>
				</TabsContent>
				<TabsContent value="SONG">
					<Suspense fallback={<TopListLoader />}>
						<ResourcesList
							category="SONG"
							editMode={editMode}
							userId={profile.userId}
							isUser={isUser}
							list={topLists?.song}
						/>
					</Suspense>
				</TabsContent>
				<TabsContent value="ARTIST">
					<Suspense fallback={<TopListLoader />}>
						<ResourcesList
							category="ARTIST"
							editMode={editMode}
							userId={profile.userId}
							list={topLists?.artist}
							isUser={isUser}
						/>
					</Suspense>
				</TabsContent>
			</Tabs>
			<Tabs value={tab}>
				<TabsList>
					<TabsTrigger value="reviews" asChild>
						<Link
							from={Route.fullPath}
							search={(prev: any) => ({
								...prev,
								tab: undefined,
							})}
						>
							Reviews
						</Link>
					</TabsTrigger>
					<TabsTrigger value="lists" asChild>
						<Link
							from={Route.fullPath}
							search={(prev: any) => ({
								...prev,
								tab: "lists",
							})}
						>
							Lists
						</Link>
					</TabsTrigger>
					{isUser && (
						<TabsTrigger value="settings" asChild>
							<Link
								from={Route.fullPath}
								search={(prev: any) => ({
									...prev,
									tab: "settings",
								})}
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
									search={(prev: any) => ({
										...prev,
										rating:
											rating === index + 1
												? undefined
												: index + 1,
									})}
									className="flex h-full flex-1 flex-col-reverse"
									key={index}
									onFocus={() => setHoverIndex(index)}
									onBlur={() => setHoverIndex(-1)}
									onMouseEnter={() => setHoverIndex(index)}
									onMouseLeave={() => setHoverIndex(-1)}
								>
									<div
										style={{
											height: `${(ratings / (Math.max(...distribution) === 0 ? 1 : Math.max(...distribution))) * 100}%`,
										}}
										className={cn(
											"h-full min-h-0 w-full rounded-t bg-[#ffb703]",
											{
												"opacity-70":
													hoverIndex === index,
											},
											{
												"bg-orange-500":
													rating === index + 1,
											},
											{
												"opacity-30":
													hoverIndex !== -1 &&
													hoverIndex !== index,
											}
										)}
									/>
								</Link>
							))}
						</div>
						<div className="flex w-full items-end gap-1 pt-1">
							{distribution?.map((ratings, index) => (
								<div
									className="flex flex-1 flex-row items-center justify-center gap-0.5"
									key={index}
								>
									{hoverIndex != index ? (
										<p className="text-center text-sm text-muted-foreground text-star-orange">
											{index + 1}
										</p>
									) : (
										<p className="text-center text-sm font-bold text-muted-foreground">
											{ratings}
										</p>
									)}
								</div>
							))}
						</div>
						<Tabs value={category} className="mt-2 w-full">
							<TabsList className="sm:w-full">
								<TabsTrigger value="all" asChild>
									<Link
										from={Route.fullPath}
										search={(prev: any) => ({
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
										search={(prev: any) => ({
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
										search={(prev: any) => ({
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
					<ReviewsList
						filters={{
							profileId: profile.userId,
							rating,
							category: category === "all" ? undefined : category,
						}}
						limit={20}
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
