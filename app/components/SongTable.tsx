import { RatingDialog } from "@/components/RatingDialog";
import { SignInRateButton } from "@/components/SignInRateButton";
import { RatingInfo } from "@/components/ui/RatingInfo";
import { api } from "@/trpc/react";
import { Track } from "@/utils/deezer";
import { cn } from "@/utils/utils";
import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { Skeleton } from "./ui/Skeleton";

const SongRatings = ({ songs, songId }: { songs: Track[]; songId: string }) => {
	const [profile] = api.profiles.me.useSuspenseQuery();
	const [ratings] = api.ratings.getList.useSuspenseQuery({
		resourceIds: songs.map((song) => String(song.id)),
		category: "SONG",
	});
	const [userRatings] = api.ratings.user.getList.useSuspenseQuery({
		category: "SONG",
		resourceIds: songs.map((song) => String(song.id)),
	});

	return (
		<div className="flex items-center gap-3">
			<RatingInfo
				initialRating={
					ratings?.find((rating) => rating.resourceId === songId) ??
					null
				}
				resource={{
					resourceId: songId,
					category: "SONG",
				}}
				size="sm"
			/>
			{profile ? (
				<RatingDialog
					initialUserRating={
						userRatings?.find(
							(rating) => rating.resourceId === songId
						) ?? null
					}
					resource={{
						parentId: "albumId",
						resourceId: "songId",
						category: "SONG",
					}}
					name="songTitle"
				/>
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
							<SongRatings
								songs={songs}
								songId={String(song.id)}
							/>
						</Suspense>
					</div>
				);
			})}
		</div>
	);
};

export default SongTable;
