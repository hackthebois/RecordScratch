import { Track, cn } from "@recordscratch/lib";
import { Link } from "expo-router";
import { View } from "react-native";
import { Text } from "./ui/text";

const SongTable = ({ songs }: { songs: Track[] }) => {
	return (
		<View className="flex w-full flex-col flex-1 mb-2 mt-4">
			{songs.map((song, index) => (
				<Link
					key={song.id}
					href={`/albums/${String(song.album.id)}/songs/${String(song.id)}`}
					className={cn(
						"w-full transition-colors border-gray-300",
						index != songs.length - 1 && " border-b "
					)}
				>
					<View className="flex flex-row p-3 items-center gap-6 ">
						<Text className="ml-4 text-muted-foreground font-bold">{index + 1}</Text>
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
