import { Album, cn } from "@recordscratch/lib";
import { Resource } from "@recordscratch/types";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import { getQueryOptions } from "~/lib/deezer";

export const ResourceItem = ({
	initialAlbum,
	resource,
	showType,
	onPress,
	showLink = true,
	direction = "horizontal",
	imageCss,
	titleCss,
	showArtist = true,
	className,
	imageWidthAndHeight = 150,
	artistNameCss,
}: {
	initialAlbum?: Album;
	resource: Resource;
	showType?: boolean;
	onPress?: () => void;
	showLink?: boolean;
	direction?: "horizontal" | "vertical";
	imageCss?: string;
	imageWidthAndHeight?: number;
	titleCss?: string;
	artistNameCss?: string;
	showArtist?: boolean;
	className?: string;
}) => {
	const router = useRouter();
	const albumId = resource.category === "SONG" ? resource.parentId : resource.resourceId;

	const { data: album, isLoading } = useQuery({
		...getQueryOptions({
			route: "/album/{id}",
			input: {
				id: albumId,
			},
		}),
		initialData: initialAlbum,
	});

	const { data: tracks, isLoading: isLoadingTracks } = useQuery({
		...getQueryOptions({
			route: "/album/{id}/tracks",
			input: {
				id: albumId,
				limit: 1000,
			},
		}),
		enabled: resource.category === "SONG",
	});

	if (isLoading || !album || (resource.category === "SONG" && isLoadingTracks)) {
		return (
			<View
				className={cn(
					"flex gap-4 rounded w-full",
					className,
					direction === "vertical" ? "flex-col" : "flex-row items-center"
				)}
			>
				<Skeleton
					className="relative min-w-[64px] rounded-xl"
					style={{
						width: imageWidthAndHeight,
						height: imageWidthAndHeight,
					}}
				/>
				<View className="flex flex-col gap-2">
					<Skeleton className="mb-1 h-4 w-32" />
					<Skeleton className="h-4 w-24" />
				</View>
			</View>
		);
	}

	const name =
		resource.category === "SONG"
			? tracks?.data.find((track) => track.id === Number(resource.resourceId))?.title
			: album?.title;

	const link =
		resource.category === "SONG"
			? `/albums/${resource.parentId}/songs/${resource.resourceId}`
			: `/albums/${resource.resourceId}`;

	return (
		<Pressable
			onPress={() => {
				if (showLink) router.push(link);
				if (onPress) onPress();
			}}
		>
			<View
				className={cn(
					"flex gap-4 rounded w-full",
					className,
					direction === "vertical" ? "flex-col" : "flex-row items-center"
				)}
			>
				{album.cover_big ? (
					<Image
						source={album.cover_big}
						style={{
							width: imageWidthAndHeight,
							height: imageWidthAndHeight,
							borderRadius: 12,
						}}
						className={cn("h-full w-full", imageCss)}
					/>
				) : (
					<View className="h-full w-full bg-muted"></View>
				)}
				<View className="flex flex-col gap-2">
					<Text className={cn(" truncate font-semibold mr-3", titleCss)}>{name}</Text>
					<View className="flex flex-row gap-1 self-baseline">
						{showType && (
							<Text className="text-muted-foreground">
								{resource.category === "SONG" ? "Song" : "Album"}
							</Text>
						)}
						{showArtist ? (
							<Text className={cn("text-muted-foreground", artistNameCss)}>
								{showType ? "• " : ""}
								{album.artist?.name}
							</Text>
						) : null}
					</View>
				</View>
			</View>
		</Pressable>
	);
};
