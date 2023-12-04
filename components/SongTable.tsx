import { serverTrpc } from "@/app/_trpc/server";
import { Rating, Resource } from "@/types/ratings";
import { SpotifyTrack } from "@/types/spotify";
import { cn } from "@/utils/utils";
import { auth } from "@clerk/nextjs";
import { unstable_cache } from "next/cache";
import { Ratings } from "./Ratings";

const SongTable = async ({ songs }: { songs: SpotifyTrack[] }) => {
	const resources: Resource[] = songs.map((song) => ({
		resourceId: song.id,
		category: "SONG",
	}));
	const ratingsList = await unstable_cache(
		async () => await serverTrpc.resource.rating.getList(resources),
		[
			`resource:rating:getList:[${resources
				.map((r) => r.resourceId)
				.join(",")}]`,
		],
		{ tags: resources.map((r) => r.resourceId) }
	)();

	let userRatingsList: Rating[] = [];
	const { userId } = auth();
	if (userId) {
		userRatingsList = await unstable_cache(
			async () => await serverTrpc.user.rating.getList(resources),
			[
				`user:rating:getList:[${resources
					.map((r) => r.resourceId)
					.join(",")}]`,
			],
			{ tags: resources.map((r) => r.resourceId) }
		)();
	}

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
						<Ratings
							name={song.name}
							resource={{
								resourceId: song.id,
								category: "SONG",
							}}
							type="list"
							initial={{
								rating: ratingsList.find(
									(r) => r.resourceId === song.id
								),
								userRating: userRatingsList.find(
									(r) => r.resourceId === song.id
								),
							}}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default SongTable;
