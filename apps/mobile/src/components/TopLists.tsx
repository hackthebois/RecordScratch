import { Category, ListWithResources, UserListItem } from "@recordscratch/types";
import { ArtistItem } from "./ArtistItem";
import { Animated, Dimensions, FlatList, View } from "react-native";
import { ResourceItem } from "./ResourceItem";
import { useRef } from "react";
import { Text } from "./Text";
import { cn } from "@recordscratch/lib";

const { width } = Dimensions.get("window");

const TopLists = ({
	album,
	song,
	artist,
	className,
}: {
	album?: ListWithResources;
	song?: ListWithResources;
	artist?: ListWithResources;
	className?: string;
}) => {
	const animatedValue = useRef(new Animated.Value(0)).current;
	if (!album)
		album = {
			resources: [],
			category: "ALBUM",
			id: "",
			userId: "",
			name: "",
			description: undefined,
			onProfile: undefined,
			createdAt: undefined,
			updatedAt: undefined,
		};
	if (!song)
		song = {
			resources: [],
			category: "SONG",
			id: "",
			userId: "",
			name: "",
			description: undefined,
			onProfile: undefined,
			createdAt: undefined,
			updatedAt: undefined,
		};
	if (!artist)
		artist = {
			resources: [],
			category: "ARTIST",
			id: "",
			userId: "",
			name: "",
			description: undefined,
			onProfile: undefined,
			createdAt: undefined,
			updatedAt: undefined,
		};
	return (
		<View className={cn("mt-2 flex-1", className)}>
			<View className="flex-1 w-full justify-start items-center">
				<FlatList
					horizontal
					data={["Top Albums", "Top Songs", "Top Artists"]}
					keyExtractor={(_, index) => index.toString()}
					renderItem={({ item, index }) => {
						const inputRange = [
							(index - 1) * width,
							index * width,
							(index + 1) * width,
						];
						const colorOutputRange = ["#000", "#ffb703", "#000"];
						const scaleOutputRange = [1, 2, 1];
						const dotScale = animatedValue.interpolate({
							inputRange,
							outputRange: scaleOutputRange,
							extrapolate: "clamp",
						});
						const color = animatedValue.interpolate({
							inputRange,
							outputRange: colorOutputRange,
							extrapolate: "clamp",
						});
						return (
							<View className=" w-40 p-2">
								<PagingTitle color={color} scale={dotScale} title={item} />
							</View>
						);
					}}
				/>
			</View>
			<View>
				<Animated.FlatList
					data={[album, song, artist]}
					horizontal
					showsHorizontalScrollIndicator={false}
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { x: animatedValue } } }],
						{ useNativeDriver: false }
					)}
					pagingEnabled={true}
					keyExtractor={(_, index) => index.toString()}
					renderItem={({ item }) => {
						return (
							<View style={{ width }}>
								<ResourceList data={item.resources} category={item.category} />
							</View>
						);
					}}
				/>
			</View>
		</View>
	);
};

export const ResourceList = ({
	data,
	category,
}: {
	data?: UserListItem[] | undefined;
	category: Category;
}) => {
	let renderItem;
	if (category === "ALBUM") {
		renderItem = renderAlbumItem;
	} else if (category === "SONG") {
		renderItem = renderSongItem;
	} else {
		renderItem = renderArtistItem;
	}
	return (
		<View className="flex w-full gap-2 justify-center mt-4 ml-2">
			<FlatList
				data={data}
				renderItem={renderItem}
				numColumns={3}
				keyExtractor={(item) => item.resourceId}
				style={{ width: "100%" }}
				contentContainerStyle={{ alignItems: "center" }}
			/>
		</View>
	);
};

const renderAlbumItem = ({ item: resource }: { item: UserListItem }) => (
	<View className="ml-2">
		<ResourceItem
			resource={{
				parentId: resource.parentId!,
				resourceId: resource.resourceId,
				category: "ALBUM",
			}}
			direction="vertical"
			titleCss="font-medium line-clamp-2 w-36"
			showArtist={false}
			imageWidthAndHeight={125}
		/>
	</View>
);

const renderSongItem = ({ item: resource }: { item: UserListItem }) => (
	<View className="ml-2">
		<ResourceItem
			resource={{
				parentId: resource.parentId!,
				resourceId: resource.resourceId,
				category: "SONG",
			}}
			direction="vertical"
			titleCss="font-medium line-clamp-2 w-36"
			showArtist={false}
			imageWidthAndHeight={125}
		/>
	</View>
);

const renderArtistItem = ({ item: resource }: { item: UserListItem }) => (
	<View className="mx-3 mb-14">
		<ArtistItem
			artistId={resource.resourceId}
			direction="vertical"
			textCss="font-medium line-clamp-2 text-center w-36"
			imageWidthAndHeight={125}
		/>
	</View>
);

const PagingTitle = ({
	scale,
	color,
	title,
}: {
	scale: Animated.AnimatedInterpolation<number>;
	color: Animated.AnimatedInterpolation<string>;
	title: string;
}) => {
	return (
		<Animated.Text
			style={{
				transform: [{ scale }],
				color,
				marginHorizontal: 10,
				fontSize: 13,
				textAlign: "center",
			}}
			className="text-center"
		>
			{title}
		</Animated.Text>
	);
};

export default TopLists;
