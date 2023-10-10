import { trpc } from "@/app/_trpc/react";
import { RatingCategory } from "@/drizzle/db/schema";
import { SpotifyTrack } from "@/types/spotify";
import { cn } from "@/utils/utils";
import { Star } from "lucide-react";
import { RatingButton } from "../rating/RatingButton";
import { Skeleton } from "../ui/skeleton";

type Props = {
	song: SpotifyTrack;
	songIds: string[];
};

const SongRating = ({ songIds, song }: Props) => {
	const [songRatings] = trpc.rating.getAllAverageSongRatings.useSuspenseQuery(
		{
			songIds,
		}
	);
	const [userSongRatings] =
		trpc.rating.getAllUserSongRatings.useSuspenseQuery({
			songIds,
		});

	const rating = songRatings?.find((rating) => rating.songId === song.id);
	const userRating = userSongRatings?.find(
		(rating) => rating.resourceId === song.id
	);

	return (
		<>
			<span
				className={cn(
					"flex items-center justify-center gap-2",
					!rating?.ratingAverage && "hidden"
				)}
			>
				<Star
					color="orange"
					fill={rating?.ratingAverage ? "orange" : "none"}
					size={18}
				/>
				<p className="text-sm font-medium sm:text-base">
					{rating ? Number(rating.ratingAverage).toFixed(1) : ""}
				</p>
			</span>
			<RatingButton
				name={song.name}
				resource={{
					type: RatingCategory.SONG,
					resourceId: song.id,
				}}
				initialRating={userRating?.rating ?? null}
			/>
		</>
	);
};

const SongRatingSkeleton = () => {
	return <Skeleton className="h-9 w-28" />;
};

export { SongRating, SongRatingSkeleton };
