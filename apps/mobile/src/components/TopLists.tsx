import { Category, ListWithResources, UserListItem } from "@recordscratch/types";
import { ArtistItem } from "./ArtistItem";
import { Animated, Dimensions, FlatList, View } from "react-native";
import { ResourceItem } from "./ResourceItem";
import { useRef } from "react";
import { Text } from "./Text";

const { width } = Dimensions.get("window");

const TopLists = ({
	album,
	song,
	artist,
}: {
	album?: ListWithResources;
	song?: ListWithResources;
	artist?: ListWithResources;
}) => {
	const animatedValue = useRef(new Animated.Value(0)).current;

	return (
		<View className="mt-2 flex-1">
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
					renderItem={({ item, index }) => {
						if (!item) return null;
						return (
							<View style={{ width }}>
								<ResourceList data={item.resources} category={item.category} />
							</View>
						);
					}}
				/>
			</View>
			<View className="flex-1 w-full justify-start items-center">
				<FlatList
					horizontal
					data={[album, song, artist]}
					keyExtractor={(_, index) => index.toString()}
					renderItem={({ index }) => {
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
							<View className="w-12 p-2">
								<PagingDot color={color} scale={dotScale} />
							</View>
						);
					}}
				/>
			</View>
		</View>
	);
};

const ResourceList = ({ data, category }: { data?: UserListItem[]; category: Category }) => {
	let renderItem;
	let label: string;
	if (category === "ALBUM") {
		label = "Top 6 Albums";
		renderItem = renderAlbumItem;
	} else if (category === "SONG") {
		label = "Top 6 Songs";
		renderItem = renderSongItem;
	} else {
		label = "Top 6 Artists";
		renderItem = renderArtistItem;
	}
	return (
		<View className="gap-2">
			<Text variant="h2" className=" flex items-center justify-center mt-3">
				{label}
			</Text>
			<FlatList
				data={data}
				renderItem={renderItem}
				numColumns={3}
				keyExtractor={(item) => item.resourceId}
			/>
		</View>
	);
};

const renderAlbumItem = ({ item: resource }: { item: UserListItem }) => (
	<ResourceItem
		resource={{
			parentId: resource.parentId!,
			resourceId: resource.resourceId,
			category: "ALBUM",
		}}
		direction="vertical"
		imageCss="w-28 rounded -mb-3"
		titleCss="font-medium line-clamp-2"
		showArtist={false}
		className="mx-1"
	/>
);

const renderSongItem = ({ item: resource }: { item: UserListItem }) => (
	<ResourceItem
		resource={{
			parentId: resource.parentId!,
			resourceId: resource.resourceId,
			category: "SONG",
		}}
		direction="vertical"
		imageCss="w-28 rounded -mb-3"
		titleCss="font-medium line-clamp-2"
		showArtist={false}
		className="mx-1"
	/>
);

const renderArtistItem = ({ item: resource }: { item: UserListItem }) => (
	<ArtistItem
		artistId={resource.resourceId}
		direction="vertical"
		textCss="font-medium line-clamp-2 -mt-2 text-center"
		imageCss="h-auto w-[7rem]"
		className="mx-1 mt-3"
	/>
);

const PagingDot = ({
	scale,
	color,
}: {
	scale: Animated.AnimatedInterpolation<number>;
	color: Animated.AnimatedInterpolation<string>;
}) => {
	return (
		<Animated.View
			style={[
				{
					width: 6,
					height: 6,
					borderRadius: 6,
					borderWidth: 0,
					borderColor: "#000",
				},
				{ backgroundColor: color, transform: [{ scale }] },
			]}
		/>
	);
};

export default TopLists;
