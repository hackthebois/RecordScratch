import { RatingDialog } from "@/components/RatingDialog";
import { SignInRateButton } from "@/components/SignInRateButton";
import { RatingInfo } from "@/components/ui/RatingInfo";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/trpc/react";
import { Track } from "@/utils/deezer";
import { cn } from "@/utils/utils";
import { Link } from "@tanstack/react-router";
import { Suspense } from "react";

const SongTable = ({ songs }: { songs: Track[] }) => {
	const { data: profile } = api.profiles.me.useQuery();

	return (
		<div className="w-full">
			{songs.map((song, index) => {
				return (
					<div
						key={song.id}
						className={cn(
							"-mx-4 flex h-12 flex-1 items-center justify-between border-b transition-colors sm:mx-0",
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
						<Suspense fallback={<Skeleton className="h-10 w-32" />}>
							<div className="flex items-center gap-3 pr-3">
								<RatingInfo
									resource={{
										resourceId: String(song.id),
										category: "SONG",
									}}
									size="sm"
								/>
								{profile ? (
									<RatingDialog
										resource={{
											parentId: String(song.album.id),
											resourceId: String(song.id),
											category: "SONG",
										}}
										name={song.title}
									/>
								) : (
									<SignInRateButton />
								)}
							</div>
						</Suspense>
					</div>
				);
			})}
		</div>
	);
};

export default SongTable;
