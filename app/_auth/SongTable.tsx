import { RateButton } from "@/app/_auth/RateButton";
import { getRatingsList, getUserRatingList } from "@/app/_trpc/cached";
import { Rating, Resource } from "@/types/rating";
import { cn } from "@/utils/utils";
import { auth } from "@clerk/nextjs";
import { SimplifiedTrack, Track } from "@spotify/web-api-ts-sdk";
import { Suspense } from "react";
import { RatingInfo } from "../../components/ui/RatingInfo";
import { Skeleton } from "../../components/ui/skeleton";

const SongRatings = async ({
	song,
	resources,
}: {
	song: SimplifiedTrack | Track;
	resources: Resource[];
}) => {
	const ratingsList = await getRatingsList(resources);

	let userRatingsList: Rating[] = [];
	const { userId } = auth();
	if (userId) {
		userRatingsList = await getUserRatingList(resources, userId);
	}

	return (
		<>
			<RatingInfo
				rating={ratingsList.find((r) => r.resourceId === song.id)!}
			/>
			<RateButton
				resource={{
					resourceId: song.id,
					category: "SONG",
				}}
				name={song.name}
				initialUserRating={userRatingsList.find(
					(r) => r.resourceId === song.id
				)}
			/>
		</>
	);
};

const SongTable = async ({ songs }: { songs: SimplifiedTrack[] | Track[] }) => {
	const resources: Resource[] = songs.map((song) => ({
		resourceId: song.id,
		category: "SONG",
	}));

	return (
		<div className="w-full">
			{songs.map((song, index) => {
				return (
					<div
						key={song.id}
						className={cn(
							"-mx-4 flex flex-1 items-center gap-3 border-b p-3 transition-colors sm:mx-0",
							index === songs.length - 1 && "border-none"
						)}
					>
						<p className="w-4 text-center text-sm text-muted-foreground">
							{index + 1}
						</p>
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm">
								{song.name.replace(/ *\([^)]*\) */g, "")}
							</p>
							<p className="truncate text-xs text-muted-foreground">
								{song.artists
									.map((artist) => artist.name)
									.join(", ")}
							</p>
						</div>
						<Suspense fallback={<Skeleton className="h-8 w-24" />}>
							<SongRatings song={song} resources={resources} />
						</Suspense>
					</div>
				);
			})}
		</div>
	);
};

export default SongTable;
