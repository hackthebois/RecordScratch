import { Track, cn } from "@recordscratch/lib";
import { Link } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "./ui/text";
import { RatingInfo } from "./Rating/RatingInfo";
import RateButton from "./Rating/RateButton";

const SongTable = ({ songs }: { songs: Track[] }) => {
	return (
		<View>
			{songs.map((song, index) => (
				<Link
					key={index}
					href={`/albums/${String(song.album.id)}/songs/${String(song.id)}`}
					className={cn(index != songs.length - 1 && "border-muted border-b-[4px]")}
					asChild
				>
					<View className="flex flex-row p-3 items-center justify-between gap-6">
						<View className="flex flex-row items-center gap-6 max-w-52">
							<Text className="ml-4 text-muted-foreground font-bold w-5">
								{index + 1}
							</Text>
							<Text className="text-md" numberOfLines={1} ellipsizeMode="tail">
								{song.title.replace(/ *\([^)]*\) */g, "")}
							</Text>
						</View>
						<View className="flex flex-row gap-4 items-center">
							<RatingInfo
								resource={{
									resourceId: String(song.id),
									category: "SONG",
								}}
								size="lg"
							/>
							<RateButton
								imageUrl={song.album.title}
								resource={{
									parentId: String(song.album.id),
									resourceId: String(song.id),
									category: "SONG",
								}}
								name={song.title}
							/>
						</View>
					</View>
				</Link>
			))}
		</View>
	);
};

export default SongTable;
