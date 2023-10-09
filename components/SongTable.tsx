import { serverTrpc } from "@/app/_trpc/server";
import { RatingCategory, UserRating } from "@/drizzle/db/schema";
import { SpotifyTrack } from "@/types/spotify";
import { cn } from "@/utils/utils";
import { auth } from "@clerk/nextjs";
import { Headphones, MoreHorizontal, Star } from "lucide-react";
import Link from "next/link";
import SongRating from "./SongRating";
import { RatingButton } from "./ratings";
import { Button } from "./ui/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/DropdownMenu";

const SongTable = async ({ songs }: { songs: SpotifyTrack[] }) => {
	const songRatings = await serverTrpc.rating.getAllAverageSongRatings({
		songIds: songs.map((song) => song.id),
	});

	const { userId } = auth();
	let userSongRatings: UserRating[] | null = null;
	if (userId) {
		userSongRatings = await serverTrpc.rating.getAllUserSongRatings({
			songIds: songs.map((song) => song.id),
		});
	}

	console.log(userSongRatings);

	return (
		<div className="w-full">
			{songs.map((song, index) => (
				<div
					key={song.id}
					className={cn(
						"flex flex-1 items-center gap-3 border-b p-3 transition-colors hover:bg-muted",
						index === songs.length - 1 && "border-none"
					)}
				>
					<p className="w-6 text-center text-sm text-muted-foreground">
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
					<SongRating
						resource={{
							resourceId: song.id,
							type: RatingCategory.SONG,
						}}
						initialRating={songRatings?.find(
							(rating) => rating.songId === song.id
						)}
					/>
					<div className="hidden sm:block">
						<RatingButton
							name={song.name}
							resource={{
								resourceId: song.id,
								type: RatingCategory.SONG,
							}}
							initialUserRating={userSongRatings?.find(
								(rating) => rating.resourceId === song.id
							)}
						/>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="h-9 w-9 p-0"
								size="sm"
							>
								<span className="sr-only">Open menu</span>
								<MoreHorizontal size={16} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>
								{song.name.replace(/ *\([^)]*\) */g, "")}
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link
									target="_blank"
									href={song.external_urls.spotify}
								>
									<Headphones className="mr-2 h-4 w-4" />
									Listen
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link
									href={{
										query: {
											resourceId: song.id,
											type: RatingCategory.SONG,
											name: song.name,
										},
									}}
								>
									<Star className="mr-2 h-4 w-4" />
									Rate
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			))}
		</div>
	);
};

export default SongTable;
