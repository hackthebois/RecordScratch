import { Track, cn } from "@recordscratch/lib";
import { Link } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "./ui/text";

const SongTable = ({ songs }: { songs: Track[] }) => {
	return (
		<View className="flex w-full flex-col flex-1">
			{songs.map((song, index) => (
				<Link
					key={index}
					href={`/albums/${String(song.album.id)}/songs/${String(song.id)}`}
					asChild
				>
					<Pressable
						className={cn(
							"flex flex-row p-3 items-center gap-6",
							"w-full border-muted",
							index != songs.length - 1 && "border-b"
						)}
					>
						<Text className="ml-4 text-muted-foreground font-bold">{index + 1}</Text>
						<Text className="w-full truncate text-lg">
							{song.title.replace(/ *\([^)]*\) */g, "")}
						</Text>
					</Pressable>
				</Link>
			))}
		</View>
	);
};

export default SongTable;
