import { getQueryOptions } from "@/utils/deezer";
import { Artist, cn } from "@recordscratch/lib";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { View } from "react-native-ui-lib";
import { Text } from "@/components/Text";

export const ArtistItem = ({
	initialArtist,
	artistId,
	onClick,
	direction = "horizontal",
	showLink = true,
	textCss = "truncate",
	imageCss,
	className,
	imageWidthAndHeight = 100,
	showType = false,
}: {
	initialArtist?: Artist;
	artistId: string;
	onClick?: () => void;
	direction?: "horizontal" | "vertical";
	showLink?: boolean;
	textCss?: string;
	imageCss?: string;
	imageWidthAndHeight?: number;
	className?: string;
	showType?: boolean;
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
	const artistImage = artist.picture_big;
	const link = `/artists/${String(artist.id)}`;

	return (
		<Link
			href={showLink ? link : ""}
			onPress={(e) => {
				if (onClick) {
					onClick();
					if (!showLink) {
						e.preventDefault();
						e.stopPropagation();
					}
				}
			}}
		>
			<View
				className={cn(
					"flex w-full items-center gap-4",
					className,
					direction === "vertical" ? "flex-col" : "flex-row"
				)}
			>
				<View className="items-center justify-center overflow-hidden rounded-full">
					{artistImage ? (
						<Image
							source={artistImage}
							className={cn("h-full w-full rounded-full", imageCss)}
							style={{ width: imageWidthAndHeight, height: imageWidthAndHeight }}
						/>
					) : (
						<View className="h-full w-full bg-muted"></View>
					)}
				</View>
				<View className="flex flex-col gap-1">
					<Text className={cn("flex flex-1 font-medium", textCss)}>{artist.name}</Text>
					{showType && <Text>{"• Artist"}</Text>}
				</View>
			</View>
		</Link>
	);
};
