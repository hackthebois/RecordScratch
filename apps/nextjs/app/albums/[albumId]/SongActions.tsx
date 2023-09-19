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
import { rateAlbum } from "@/server/rating";
import { SpotifyTrack } from "@/types/spotify";
import { Headphones, MoreHorizontal, Star } from "lucide-react";
import Link from "next/link";
import RatingDialog from "./RatingDialog";

type Props = {
	song: SpotifyTrack;
};

const SongActions = ({ song }: Props) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="h-8 w-8 p-0">
					<span className="sr-only">Open menu</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Song Actions</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<RatingDialog
					name={song.name}
					onSubmit={rateAlbum}
					albumId={"songId"}
				>
					<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
						<Star className="mr-2 h-4 w-4" />
						Rate
					</DropdownMenuItem>
				</RatingDialog>
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
