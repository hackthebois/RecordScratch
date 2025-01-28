import { Text } from "@/components/ui/text";
import { getQueryOptions } from "@/lib/deezer";
import { Artist, cn } from "@recordscratch/lib";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Link, LinkProps } from "expo-router";
import { StyleProp, View, ViewStyle } from "react-native";
import { Skeleton } from "../ui/skeleton";
import ReLink from "../ReLink";

export const ArtistItem = ({
	initialArtist,
	artistId,
	onPress,
	direction = "horizontal",
	showLink = true,
	textCss = "truncate",
	imageCss,
	className,
	imageWidthAndHeight = 100,
	showType = false,
	style,
}: {
	initialArtist?: Artist;
	artistId: string;
	onPress?: () => void;
	direction?: "horizontal" | "vertical";
	showLink?: boolean;
	textCss?: string;
	imageCss?: string;
	imageWidthAndHeight?: number;
	className?: string;
	showType?: boolean;
	style?: StyleProp<ViewStyle>;
}) => {
	const { data: artist } = useQuery({
		...getQueryOptions({
			route: "/artist/{id}",
			input: {
				id: artistId,
			},
		}),
		initialData: initialArtist,
	});

	if (!artist) {
		return (
			<View
				className={cn(
					"flex items-center gap-4",
					className,
					direction === "vertical" ? "flex-col" : "flex-row"
				)}
			>
				<View
					style={{
						width: imageWidthAndHeight,
						height: imageWidthAndHeight,
					}}
				>
					<Skeleton className="relative w-full h-full rounded-full" />
				</View>
				<View className="justify-center gap-1">
					<Skeleton className="mb-1 h-4 w-32" />
					{showType ? <Skeleton className="h-4 w-24" /> : null}
				</View>
			</View>
		);
	}

	const artistImage = artist.picture_big;

	return (
		<ReLink
			disabled={!showLink}
			href={`/artists/${String(artist.id)}`}
			onPress={(e) => {
				if (onPress) {
					onPress();
					if (!showLink) {
						e.preventDefault();
						e.stopPropagation();
					}
				}
			}}
		>
			<View
				className={cn(
					"flex items-center gap-4",
					className,
					direction === "vertical" ? "flex-col" : "flex-row"
				)}
				style={style}
			>
				<View className="items-center justify-center rounded-full overflow-hidden">
					{artistImage ? (
						<Image
							source={artistImage}
							className={cn("border-2", imageCss)}
							contentFit="cover"
							style={{ width: imageWidthAndHeight, height: imageWidthAndHeight }}
						/>
					) : (
						<View className="h-full bg-muted"></View>
					)}
				</View>
				<View className="justify-center gap-1">
					<Text
						className={cn(
							"flex font-semibold",
							direction === "vertical" ? "text-center" : "",
							textCss
						)}
						numberOfLines={2}
					>
						{artist.name}
					</Text>
					{showType && <Text className="text-muted-foreground">{"Artist"}</Text>}
				</View>
			</View>
		</ReLink>
	);
};
