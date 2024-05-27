import { Track, cn } from "@recordscratch/lib";
import { Link } from "expo-router";

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
							href={`/albums/${String(song.album.id)}/songs/${String(song.id)}`}
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
					</div>
				);
			})}
		</div>
	);
};

export default SongTable;
