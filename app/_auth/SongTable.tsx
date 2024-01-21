import { getRatingsList, getUserRatingList } from "@/app/_api/cached";
import { RateButton } from "@/app/_auth/RateButton";
import { RateForm, Rating, Resource } from "@/types/rating";
import { cn } from "@/utils/utils";
import { auth } from "@clerk/nextjs";
import { SimplifiedTrack, Track } from "@spotify/web-api-ts-sdk";
import { revalidatePath, unstable_noStore } from "next/cache";
import { Suspense } from "react";
import { RatingInfo } from "../../components/ui/RatingInfo";
import { Skeleton } from "../../components/ui/skeleton";
import { deleteRatingAction, rateAction } from "../_api/actions";

const SongRatings = async ({
	song,
	resources,
	resource,
}: {
	song: SimplifiedTrack | Track;
	resources: Resource[];
	resource: Resource;
}) => {
	unstable_noStore();
	const ratingsList = await getRatingsList(resources);

	let userRatingsList: Rating[] = [];
	const { userId } = auth();
	if (userId) {
		userRatingsList = await getUserRatingList(resources, userId);
	}

	const onRate = async (input: RateForm) => {
		"use server";
		if (input.rating === 0) {
			await deleteRatingAction(input);
		} else {
			await rateAction(input);
		}
		revalidatePath(
			resource.category === "ALBUM"
				? `/albums/${resource.resourceId}`
				: `/artists/${resource.resourceId}`
		);
	};

	return (
		<>
			<RatingInfo
				rating={ratingsList.find((r) => r.resourceId === song.id)!}
				size="sm"
			/>
			<RateButton
				resource={{
					resourceId: song.id,
					category: "SONG",
				}}
				onRate={onRate}
				name={song.name}
				userRating={
					userRatingsList.find((r) => r.resourceId === song.id) ??
					null
				}
			/>
		</>
	);
};

const SongTable = async ({
	songs,
	resource,
}: {
	songs: SimplifiedTrack[] | Track[];
	resource: Resource;
}) => {
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
							<SongRatings
								song={song}
								resources={resources}
								resource={resource}
							/>
						</Suspense>
					</div>
				);
			})}
		</div>
	);
};

export default SongTable;
