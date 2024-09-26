import { Track } from "@recordscratch/lib";
import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "./ui/text";

const SongTable = ({
	songs,
	ListHeaderComponent,
}: {
	songs: Track[];
	ListHeaderComponent?: JSX.Element;
}) => {
	return (
		<FlashList
			data={songs}
			keyExtractor={(item, index) => `song-${item.id}-${index}`}
			estimatedItemSize={40}
			renderItem={({ item: song, index }) => (
				<Link
					key={index}
					href={`/albums/${String(song.album.id)}/songs/${String(song.id)}`}
					asChild
				>
					<Pressable className={"flex flex-row p-3 items-center gap-6 w-full"}>
						<Text className="ml-4 text-muted-foreground font-bold">{index + 1}</Text>
						<Text className="w-full text-lg" numberOfLines={1} ellipsizeMode="tail">
							{song.title.replace(/ *\([^)]*\) */g, "")}
						</Text>
					</Pressable>
				</Link>
			)}
			ItemSeparatorComponent={() => <View className="h-1 bg-muted" />}
			ListHeaderComponent={ListHeaderComponent}
		/>
	);
};

export default SongTable;
