import { getQueryOptions } from "@/utils/deezer";
import { Album, cn } from "@recordscratch/lib";
import { Resource } from "@recordscratch/types";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "./Text";

export const ResourceItem = ({
	initialAlbum,
	resource,
	showType,
	onClick,
	showLink = true,
	direction = "horizontal",
	imageCss,
	titleCss,
	showArtist = true,
	className,
}: {
	initialAlbum?: Album;
	resource: Resource;
	showType?: boolean;
	onClick?: () => void;
	showLink?: boolean;
	direction?: "horizontal" | "vertical";
	imageCss?: string;
	titleCss?: string;
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
			<View className="flex flex-row items-center gap-4 rounded">
				{/* <Skeleton className="relative h-16 w-16 min-w-[64px] rounded" />
				<div className="flex flex-col gap-2">
					<Skeleton className="mb-1 h-4 w-32" />
					<Skeleton className="h-4 w-24" />
				</div> */}
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
		<Link
			onPress={() => {
				if (onClick) {
					onClick();
				}
			}}
			href={link}
		>
			<View
				className={cn(
					"flex gap-4 rounded w-full",
					className,
					direction === "vertical" ? "flex-col" : "flex-row items-center"
				)}
				style={{
					width: 128,
				}}
			>
				{album.cover_big ? (
					<img src={album.cover_big} className={cn("h-full w-full", imageCss)} />
				) : (
					<View className="h-full w-full bg-muted"></View>
				)}
				<View className="flex flex-col gap-2">
					<Text className="w-full font-semibold">{name}</Text>
					<View className="flex gap-1">
						<Pressable
							onPress={() => {
								router.push("/artists/$artistId");
							}}
						>
							<Text className="text-muted-foreground truncate">
								{showArtist ? album.artist?.name : ""}
							</Text>
						</Pressable>
						{showType && (
							<Text>{resource.category === "SONG" ? "• Song" : "• Album"}</Text>
						)}
					</View>
				</View>
			</View>
		</Link>
	);
};
