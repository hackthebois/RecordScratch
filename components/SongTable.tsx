"use client";

import { RatingCategory } from "@/drizzle/db/schema";
import { SpotifyTrack } from "@/types/spotify";
import { cn } from "@/utils/utils";
import { Headphones, MoreHorizontal, Star } from "lucide-react";
import Link from "next/link";
import { RatingDialog, RatingProvider } from "./ratings";
import { Button } from "./ui/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/DropdownMenu";

const SongTable = ({ songs }: { songs: SpotifyTrack[] }) => {
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
					<RatingProvider
						resource={{
							resourceId: song.id,
							type: RatingCategory.SONG,
						}}
					>
						{({ rating, userRating, onChange }) => (
							<>
								<span
									className={cn(
										"flex items-center justify-center gap-2",
										!rating?.ratingAverage && "hidden"
									)}
								>
									<Star
										color="orange"
										fill={
											rating?.ratingAverage
												? "orange"
												: "none"
										}
										size={18}
									/>
									<p className="text-sm font-medium sm:text-base">
										{rating
											? Number(
													rating.ratingAverage
											  ).toFixed(1)
											: ""}
									</p>
								</span>
								<div className="hidden sm:block">
									<RatingDialog.Button
										userRating={userRating}
										onChange={onChange}
									/>
								</div>
							</>
						)}
					</RatingProvider>
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
							<RatingProvider
								resource={{
									resourceId: song.id,
									type: RatingCategory.SONG,
								}}
							>
								{({ onChange }) => (
									<RatingDialog
										name={song.name}
										onChange={onChange}
									>
										<DropdownMenuItem
											onSelect={(e) => e.preventDefault()}
										>
											<>
												<Star className="mr-2 h-4 w-4" />
												Rate
											</>
										</DropdownMenuItem>
									</RatingDialog>
								)}
							</RatingProvider>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			))}
		</div>
	);
};

export default SongTable;
