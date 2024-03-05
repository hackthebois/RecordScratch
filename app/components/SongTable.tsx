import { RatingDialog } from "@/components/RatingDialog";
import { SignInRateButton } from "@/components/SignInRateButton";
import { RatingInfo } from "@/components/ui/RatingInfo";
import { api } from "@/trpc/react";
import { Resource } from "@/types/rating";
import { Track } from "@/utils/deezer";
import { cn } from "@/utils/utils";
import { keepPreviousData } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { Skeleton } from "./ui/Skeleton";
import { AddToList } from "./lists/AddToList";

const SongRatingDialog = ({ songs, song }: { songs: Track[]; song: Track }) => {
	const [userRatings] = api.ratings.user.getList.useSuspenseQuery({
		category: "SONG",
		resourceIds: songs.map((song) => String(song.id)),
	});

	const resource: Resource = {
		parentId: String(song.album.id),
		resourceId: String(song.id),
		category: "SONG",
	};

	return (
		<RatingDialog
			initialUserRating={
				userRatings?.find(
					(rating) => rating.resourceId === resource.resourceId
				) ?? null
			}
			resource={resource}
			name={song.title}
		/>
	);
};

const SongRatings = ({ songs, song }: { songs: Track[]; song: Track }) => {
	const [profile] = api.profiles.me.useSuspenseQuery();
	const { data: ratings, isLoading } = api.ratings.getList.useQuery(
		{
			resourceIds: songs.map((song) => String(song.id)),
			category: "SONG",
		},
		{
			placeholderData: keepPreviousData,
		}
	);

	if (isLoading) {
		return <Skeleton className="h-12 w-24" />;
	}

	const resource: Resource = {
		parentId: String(song.album.id),
		resourceId: String(song.id),
		category: "SONG",
	};

	return (
		<div className="flex items-center gap-3">
			<RatingInfo
				initialRating={
					ratings?.find(
						(rating) => rating.resourceId === resource.resourceId
					) ?? null
				}
				resource={resource}
				size="sm"
			/>
			{profile ? (
				<>
					<SongRatingDialog songs={songs} song={song} />
					<AddToList
						parentId={String(song.album.id)}
						resourceId={String(song.id)}
						category="SONG"
					/>
				</>
			) : (
				<SignInRateButton />
			)}
		</div>
	);
};

const SongTable = ({ songs }: { songs: Track[] }) => {
	return (
		<div className="flex w-full flex-col items-center justify-center">
			{songs.map((song, index) => {
				return (
					<div
						key={song.id}
						className={cn(
							"-mx-4 flex h-12 w-full flex-1 items-center justify-between border-b transition-colors sm:mx-0",
							index === songs.length - 1 && "border-none"
						)}
					>
						<Link
							to="/albums/$albumId/songs/$songId"
							params={{
								albumId: String(song.album.id),
								songId: String(song.id),
							}}
							className="flex w-full min-w-0 gap-3 p-3"
						>
							<p className="w-4 text-center text-sm text-muted-foreground">
								{index + 1}
							</p>
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm">
									{song.title.replace(/ *\([^)]*\) */g, "")}
								</p>
							</div>
						</Link>
						<Suspense fallback={<Skeleton className="h-12 w-24" />}>
							<SongRatings songs={songs} song={song} />
						</Suspense>
					</div>
				);
			})}
		</div>
	);
};

export default SongTable;
