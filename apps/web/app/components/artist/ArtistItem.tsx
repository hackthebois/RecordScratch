import { Artist, getQueryOptions } from "@recordscratch/utils/deezer";
import { cn } from "@recordscratch/utils/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { UserAvatar } from "../user/UserAvatar";

export const ArtistItem = ({
	initialArtist,
	artistId,
	onClick,
	direction = "horizontal",
	showLink = true,
	textCss = "truncate",
	imageCss,
}: {
	initialArtist?: Artist;
	artistId: string;
	onClick?: () => void;
	direction?: "horizontal" | "vertical";
	showLink?: boolean;
	textCss?: string;
	imageCss?: string;
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
			onClick={() => {
				if (onClick) {
					onClick();
				}
			}}
			{...(showLink ? link : {})}
			className={cn(
				"flex w-full min-w-0 items-center gap-4",
				direction === "vertical" ? "flex-col" : "flex-row"
			)}
		>
			{/* <div className="items-center justify-center overflow-hidden rounded-full"> */}
			{artistImage ? (
				<UserAvatar
					imageUrl={artistImage}
					className={cn(
						imageCss,
						direction === "horizontal" ? "h-16 w-16" : "h-24 w-24"
					)}
				/>
			) : (
				<div className="h-full w-full bg-muted"></div>
			)}
			{/* </div> */}
			<p className={cn("flex flex-1 font-medium", textCss)}>
				{artist.name}
			</p>
		</Link>
	);
};
