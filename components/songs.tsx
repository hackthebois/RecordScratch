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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/Table";

export const SongRow = ({
	song,
	index,
}: {
	song: SpotifyTrack;
	index: number;
}) => {
	return (
		<TableRow key={song.id}>
			<TableCell className="p-0 text-right text-muted-foreground">
				{index + 1}
			</TableCell>
			<TableCell className="w-full whitespace-nowrap">
				{song.name}
			</TableCell>
			<TableCell className="flex flex-row-reverse gap-4 px-0">
				<RatingProvider
					resource={{
						resourceId: song.id,
						type: RatingCategory.SONG,
					}}
				>
					{({ rating, userRating, onChange }) => (
						<>
							<RatingDialog.Button
								userRating={userRating}
								onChange={onChange}
							/>
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
								<p className="font-medium">
									{rating ? Number(rating).toFixed(1) : ""}
								</p>
							</span>
						</>
					)}
				</RatingProvider>
			</TableCell>
			<TableCell>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="h-9 w-9 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal size={16} />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Song Actions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link
								target="_blank"
								href={song.external_urls.spotify}
							>
								<Headphones className="mr-2 h-4 w-4" />
								Listen on spotify
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
};

export const SongTable = ({ songs }: { songs: SpotifyTrack[] }) => {
	console.log(songs);
	return (
		<Table className="mt-10 w-full">
			<TableHeader>
				<TableRow>
					<TableHead className="pl-4 pr-0">#</TableHead>
					<TableHead>Song</TableHead>
					<TableHead className="p-0">Rating</TableHead>
					<TableHead></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{songs.map((song, index) => (
					<SongRow song={song} index={index} key={index} />
				))}
			</TableBody>
		</Table>
	);
};
