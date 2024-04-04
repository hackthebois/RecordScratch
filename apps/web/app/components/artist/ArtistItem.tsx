import { Artist, cn, getQueryOptions } from "@recordscratch/lib";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

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
			onClick={(e) => {
				if (onClick) {
					onClick();
					e.preventDefault();
					e.stopPropagation();
				}
			}}
			{...(showLink ? link : {})}
			className={cn(
				"flex w-full items-center gap-4",
				direction === "vertical" ? "flex-col" : "flex-row"
			)}
		>
			<div className="items-center justify-center overflow-hidden rounded-full">
				{artistImage ? (
					<img
						src={artistImage}
						className={cn("h-full w-full rounded-full", imageCss)}
					/>
				) : (
					<div className="h-full w-full bg-muted"></div>
				)}
			</div>
			<p className={cn("flex flex-1 font-medium", textCss)}>
				{artist.name}
			</p>
		</Link>
	);
};
