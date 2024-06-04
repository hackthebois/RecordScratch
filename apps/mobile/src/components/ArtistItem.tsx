import { getQueryOptions } from "@/utils/deezer";
import { Artist, cn } from "@recordscratch/lib";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { View } from "react-native-ui-lib";

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
					if (!showLink) {
						e.preventDefault();
						e.stopPropagation();
					}
				}
			}}
			{...(showLink ? link : {})}
			className={cn(
				"flex w-full items-center gap-4",
				direction === "vertical" ? "flex-col" : "flex-row"
			)}
		>
			<View className="items-center justify-center overflow-hidden rounded-full">
				{artistImage ? (
					<img src={artistImage} className={cn("h-full w-full rounded-full", imageCss)} />
				) : (
					<View className="h-full w-full bg-muted"></View>
				)}
			</View>
			<p className={cn("flex flex-1 font-medium", textCss)}>{artist.name}</p>
		</Link>
	);
};
