import { Track, cn } from "@recordscratch/lib";
import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";
import { View } from "react-native";
import { Text } from "./ui/text";

const SongTable = ({ songs }: { songs: Track[] }) => {
	return (
		<View className="flex w-full flex-col flex-1">
			<FlashList
				data={songs}
				renderItem={({ item, index }) => (
					<Link
						href={`/albums/${String(item.album.id)}/songs/${String(item.id)}`}
						className={cn(
							"w-full border-gray-300",
							index != songs.length - 1 && "border-b"
						)}
						asChild
					>
						<View className="flex flex-row p-3 items-center gap-6">
							<Text className="ml-4 text-muted-foreground font-bold">
								{index + 1}
							</Text>
							<Text className="w-full truncate text-lg">
								{item.title.replace(/ *\([^)]*\) */g, "")}
							</Text>
						</View>
					</Link>
				)}
				estimatedItemSize={60}
			/>
		</View>
	);
};

export default SongTable;
