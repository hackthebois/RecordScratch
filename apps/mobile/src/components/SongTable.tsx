import { Track, cn } from "@recordscratch/lib";
import { Link } from "expo-router";
import { Pressable, View } from "react-native";
import RateButton from "./Rating/RateButton";
import { RatingInfo } from "./Rating/RatingInfo";
import { Text } from "./ui/text";

const SongTable = ({ songs }: { songs: Track[] }) => {
	return (
		<View>
			{songs.map((song, index) => (
				<Link
					key={index}
					href={`/albums/${String(song.album.id)}/songs/${String(song.id)}`}
					className={cn(
						"w-full",
						index != songs.length - 1 &&
							"border-muted border-b-[2px]"
					)}
					asChild
				>
					<Pressable className="flex flex-row py-2 items-center justify-between gap-6 px-4">
						<View className="flex flex-row items-center max-w-52 gap-2">
							<Text className="text-muted-foreground font-bold w-6">
								{index + 1}
							</Text>
							<Text numberOfLines={1}>
								{song.title.replace(/ *\([^)]*\) */g, "")}
							</Text>
						</View>
						<View className="flex flex-row gap-4 items-center">
							<RatingInfo
								resource={{
									resourceId: String(song.id),
									parentId: String(song.album.id),
									category: "SONG",
								}}
								size="sm"
							/>
							<RateButton
								imageUrl={song.album.cover_big}
								resource={{
									parentId: String(song.album.id),
									resourceId: String(song.id),
									category: "SONG",
								}}
								name={song.title}
								size="sm"
							/>
						</View>
					</Pressable>
				</Link>
			))}
		</View>
	);
};

export default SongTable;
