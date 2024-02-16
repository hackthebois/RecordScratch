import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/trpc/react";
import { Resource } from "@/types/rating";
import { Track } from "@/utils/deezer";
import { cn } from "@/utils/utils";
import { useAuth } from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import RateButton from "./RateButton";
import { RatingInfo } from "./ui/RatingInfo";

const SongRatings = ({ song, resources }: { song: Track; resources: Resource[] }) => {
	const { userId } = useAuth();

	const { data: ratingsList, isLoading } = api.ratings.list.useQuery(resources);

	const { data: userRatingList, isLoading: isLoadingUser } = api.ratings.user.getList.useQuery(
		resources,
		{
			enabled: !!userId,
		}
	);

	const userRating = useMemo(
		() => userRatingList?.find((r) => r.resourceId === String(song.id)),
		[userRatingList]
	);

	if (isLoading || isLoadingUser) {
		return <Skeleton className="h-8 w-24" />;
	}

	return (
		<>
			<RatingInfo
				rating={ratingsList.find((r) => r.resourceId === String(song.id))!}
				size="sm"
			/>
			<RateButton
				resource={{
					resourceId: String(song.id),
					category: "SONG",
				}}
				name={song.title}
				userRating={userRating ?? null}
			/>
		</>
	);
};

const SongTable = ({ songs }: { songs: Track[] }) => {
	const resources: Resource[] = songs.map((song) => ({
		resourceId: String(song.id),
		category: "SONG",
	}));
	return (
		<div className="w-full">
			{songs.map((song, index) => {
				return (
					<div
						key={song.id}
						className={cn(
							"-mx-4 flex flex-1 items-center justify-between border-b transition-colors sm:mx-0",
							index === songs.length - 1 && "border-none"
						)}
					>
						<Link to="/" className="flex w-full min-w-0 gap-3 p-3">
							<p className="w-4 text-center text-sm text-muted-foreground">
								{index + 1}
							</p>
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm">
									{song.title.replace(/ *\([^)]*\) */g, "")}
								</p>
							</div>
						</Link>
						<div className="flex items-center gap-3 pr-3">
							<SongRatings song={song} resources={resources} />
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default SongTable;
