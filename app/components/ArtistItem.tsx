import { Artist } from "@/utils/deezer";
import { Link } from "@tanstack/react-router";
import { UserAvatar } from "./UserAvatar";

export const ArtistItem = ({
	artist,
	onClick,
}: {
	artist: Artist;
	onClick?: () => void;
}) => {
	const artistImage = artist.picture_medium;

	return (
		<Link
			to="/artists/$artistId"
			params={{
				artistId: String(artist.id),
			}}
			onClick={onClick}
			className="flex w-full min-w-0 flex-row items-center gap-4 rounded"
		>
			<div className="relative h-16 w-16 min-w-[64px] overflow-hidden rounded-full">
				{artistImage ? (
					<UserAvatar imageUrl={artistImage} size={64} />
				) : (
					<div className="h-full w-full bg-muted"></div>
				)}
			</div>
			<p className="flex flex-1 truncate font-medium">{artist.name}</p>
		</Link>
	);
};
