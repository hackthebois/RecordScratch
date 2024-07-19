import { Track, cn } from "@recordscratch/lib";
import { Link } from "expo-router";
import { View } from "react-native";
import { Text } from "#/components/CoreComponents/Text";

const SongTable = ({ songs }: { songs: Track[] }) => {
	return (
		<View className="flex w-full flex-col flex-1 mb-2">
			{songs.map((song, index) => (
				<Link
					key={song.id}
					href={`/albums/${String(song.album.id)}/songs/${String(song.id)}`}
					className={cn(
						"h-12 w-full transition-colors",
						index != songs.length - 1 && "border-b border-gray-300"
					)}
				>
					<View className="flex flex-row p-3 items-center gap-3">
						<Text className="text-muted-foreground font-bold">{index + 1}</Text>
						<Text className="w-full truncate text-lg">
							{song.title.replace(/ *\([^)]*\) */g, "")}
						</Text>
					</View>
				</Link>
			))}
		</View>
	);
};

export default SongTable;
