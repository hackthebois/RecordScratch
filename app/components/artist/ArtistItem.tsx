import { Artist, getQueryOptions } from "@/utils/deezer";
import { cn } from "@/utils/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { UserAvatar } from "../UserAvatar";

export const ArtistItem = ({
	initialArtist,
	artistId,
	onClick,
	direction = "horizontal",
}: {
	initialArtist?: Artist;
	artistId: string;
	onClick?: () => void;
	direction?: "horizontal" | "vertical";
}) => {
	const { data: artist } = useSuspenseQuery({
		...getQueryOptions({
			route: "/artist/{id}",
			input: {
				id: artistId,
			},
		}),
		initialData: initialArtist,
	});
	const artistImage = artist.picture_medium;
	const link = {
		to: "/artists/$artistId",
		params: {
			artistId: String(artist.id),
		},
	};

	return (
		<Link
			onClick={(event) => {
				if (onClick) {
					event.preventDefault();
					onClick();
				}
			}}
			{...(onClick ? {} : link)}
			className={cn(
				"flex w-full min-w-0 items-center gap-4 rounded",
				direction === "vertical" ? "flex-col" : "flex-row"
			)}
		>
			<div className="relative overflow-hidden rounded-full">
				{artistImage ? (
					<UserAvatar
						imageUrl={artistImage}
						size={direction === "horizontal" ? 64 : 96}
					/>
				) : (
					<div className="h-full w-full bg-muted"></div>
				)}
			</div>
			<p className="flex flex-1 truncate font-medium">{artist.name}</p>
		</Link>
	);
};
