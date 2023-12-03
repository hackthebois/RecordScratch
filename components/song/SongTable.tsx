"use client";

import { SpotifyTrack } from "@/types/spotify";
import { cn } from "@/utils/utils";

const SongTable = ({ songs }: { songs: SpotifyTrack[] }) => {
	return (
		<div className="w-full">
			{songs.map((song, index) => {
				return (
					<div
						key={song.id}
						className={cn(
							"-mx-4 flex flex-1 items-center gap-3 border-b p-3 transition-colors hover:bg-muted sm:mx-0",
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
						{/* <Suspense fallback={<SongRatingSkeleton />}>
							<SongRating
								song={song}
								songIds={songs.map((song) => song.id)}
							/>
						</Suspense> */}
					</div>
				);
			})}
		</div>
	);
};

export default SongTable;
