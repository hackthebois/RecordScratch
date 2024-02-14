"use client";

import { cn } from "@/utils/utils";
import Link from "next/link";
import { Track } from "../_api/deezer";

const SongTable = async ({ songs }: { songs: Track[] }) => {
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
							{/* <Suspense
								fallback={<Skeleton className="h-8 w-24" />}
							>
								<Ratings resource={resources[index]} />
							</Suspense> */}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default SongTable;
