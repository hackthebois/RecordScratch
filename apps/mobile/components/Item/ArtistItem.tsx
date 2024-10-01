import { Artist, cn } from "@recordscratch/lib";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { getQueryOptions } from "~/lib/deezer";

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
				<View className="items-center justify-center rounded-full overflow-hidden">
					{artistImage ? (
						<Image
							source={artistImage}
							className={cn("w-full border-2", imageCss)}
							contentFit="cover"
							style={{ width: imageWidthAndHeight, height: imageWidthAndHeight }}
						/>
					) : (
						<View className="h-full w-full bg-muted"></View>
					)}
				</View>
				<View className="justify-center gap-1">
					<Text className={cn("flex font-medium", textCss)}>{artist.name}</Text>
					{showType && <Text className="text-muted-foreground">{"Artist"}</Text>}
				</View>
			</View>
		</Link>
	);
};
