import { trpc } from "@/app/_trpc/react";
import { RatingCategory } from "@/drizzle/db/schema";
import { SpotifyTrack } from "@/types/spotify";
import { cn } from "@/utils/utils";
import { useAuth } from "@clerk/nextjs";
import { Star } from "lucide-react";
import { RatingButton } from "../rating/RatingButton";
import { Skeleton } from "../ui/skeleton";

type Props = {
	song: SpotifyTrack;
	songIds: string[];
};

const UserRating = ({ songIds, song }: Props) => {
	const [userSongRatings] =
		trpc.rating.getAllUserSongRatings.useSuspenseQuery({
			songIds,
		});
	const userRating = userSongRatings?.find(
		(rating) => rating.resourceId === song.id
	);
	return (
		<RatingButton
			name={song.name}
			resource={{
				type: RatingCategory.SONG,
				resourceId: song.id,
			}}
			initialRating={userRating?.rating ?? null}
		/>
	);
};

const SongRating = ({ songIds, song }: Props) => {
	const { userId } = useAuth();
	const [songRatings] = trpc.rating.getAllAverageSongRatings.useSuspenseQuery(
		{
			songIds,
		}
	);
	const rating = songRatings?.find((rating) => rating.songId === song.id);

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
			{userId ? (
				<UserRating song={song} songIds={songIds} />
			) : (
				<RatingButton
					name={song.name}
					resource={{
						type: RatingCategory.SONG,
						resourceId: song.id,
					}}
					initialRating={null}
				/>
			)}
		</>
	);
};

const SongRatingSkeleton = () => {
	return <Skeleton className="h-9 w-28" />;
};

export { SongRating, SongRatingSkeleton };
