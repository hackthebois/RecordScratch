import { getAlbum, getSong } from "@/app/_trpc/cached";
import { Profile } from "@/types/profile";
import { Rating, Resource } from "@/types/rating";
import { SpotifyAlbum } from "@/types/spotify";
import { Star } from "lucide-react";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { AlbumItem } from "./album/AlbumItem";

export const Review = async ({
	review,
	profile,
	resource,
}: {
	review: Rating;
	profile: Profile;
	resource: Resource;
}) => {
	let album: SpotifyAlbum | undefined = undefined;
	let songName: string | undefined = undefined;
	if (resource.category === "ALBUM") {
		album = await getAlbum(resource.resourceId);
	} else {
		const song = await getSong(resource.resourceId);
		album = song.album;
		songName = song.name;
	}

	return (
		<div className="flex flex-col gap-4 py-4 text-card-foreground">
			<AlbumItem album={album} song={songName} showType />
			<div className="flex flex-1 flex-col gap-3">
				<div className="flex items-center gap-1">
					{Array.from(Array(review.rating)).map((_, i) => (
						<Star
							key={i}
							size={18}
							color="#ffb703"
							fill="#ffb703"
						/>
					))}
					{Array.from(Array(10 - review.rating)).map((_, i) => (
						<Star key={i} size={18} color="#ffb703" />
					))}
				</div>
				<Link
					href={`/${profile.handle}`}
					className="flex items-center gap-2"
				>
					<UserAvatar {...profile} size={30} />
					<p className="flex">{profile.name}</p>
				</Link>
				<p className="whitespace-pre-line text-sm">{review.content}</p>
			</div>
		</div>
	);
};
