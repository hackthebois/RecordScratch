"use client";

import { Button } from "@/components/ui/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { SpotifyTrack } from "@/types/spotify";
import { Headphones, MoreHorizontal, Star } from "lucide-react";
import Link from "next/link";
import { SongRatingDialog } from "./Ratings";

type Props = {
	song: SpotifyTrack;
	albumId: string;
};

const SongActions = ({ song, albumId }: Props) => {
	return (
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
				<SongRatingDialog albumId={albumId} song={song}>
					<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
						<Star className="mr-2 h-4 w-4" />
						Rate
					</DropdownMenuItem>
				</SongRatingDialog>
				<DropdownMenuItem asChild>
					<Link target="_blank" href={song.external_urls.spotify}>
						<Headphones className="mr-2 h-4 w-4" />
						Listen on spotify
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default SongActions;
