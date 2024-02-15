"use client";

import { getRatingsList, getUserRatingList } from "@/recordscratch/app/_api";
import RateButton from "@/recordscratch/app/_auth/RateButton";
import { Resource } from "@/recordscratch/types/rating";
import { cn } from "@/recordscratch/utils/utils";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo } from "react";
import { Track } from "../app/_api/deezer";
import { RatingInfo } from "./ui/RatingInfo";
import { Skeleton } from "./ui/skeleton";

const SongRatings = ({
	song,
	resources,
}: {
	song: Track;
	resources: Resource[];
}) => {
	const { userId } = useAuth();

	const { data: ratingsList } = useQuery({
		queryKey: ["rating", "list", resources.map((r) => r)],
		queryFn: () => getRatingsList(resources),
	});

	const { data: userRatingList } = useQuery({
		queryKey: ["rating", "user-list", resources.map((r) => r), userId],
		queryFn: () => {
			if (!userId) return [];
			return getUserRatingList(resources, userId);
		},
	});

	const userRating = useMemo(
		() => userRatingList?.find((r) => r.resourceId === String(song.id)),
		[userRatingList]
	);

	if (!ratingsList || !userRatingList) {
		return <Skeleton className="h-8 w-24" />;
	}

	return (
		<>
			<RatingInfo
				rating={
					ratingsList.find((r) => r.resourceId === String(song.id))!
				}
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

const SongTable = async ({ songs }: { songs: Track[] }) => {
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
						<Link
							href={`/songs/${song.id}`}
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
