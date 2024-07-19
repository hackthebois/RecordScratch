import { useRecents } from "&/recents";
import { Loader2 } from "lucide-react-native";
import { ScrollView } from "react-native";
import { View } from "react-native-ui-lib";
import { Text } from "#/components/CoreComponents/Text";
import { ArtistItem } from "#/components/Item/ArtistItem";
import { ResourceItem } from "#/components/Item/ResourceItem";
import { ProfileItem } from "#/components/Item/ProfileItem";
import { api } from "#/utils/api";

export const SearchState = ({
	isError,
	isLoading,
	noResults,
	children,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onNavigate,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	hide,
}: {
	isLoading: boolean;
	isError: boolean;
	noResults: boolean;
	onNavigate: () => void;
	children: React.ReactNode;
	hide?: {
		artists?: boolean;
		albums?: boolean;
		profiles?: boolean;
		songs?: boolean;
	};
}) => {
	const recentStore = useRecents("SEARCH");
	const { recents, addRecent } = recentStore();
	const [myProfile] = api.profiles.me.useSuspenseQuery();

	if (isError) {
		return (
			<View className="flex flex-1 items-center justify-center">
				<Text className="text-muted-foreground">An error occurred</Text>
				<Text className="text-muted-foreground">An error occurred</Text>
			</View>
		);
	}

	if (isLoading) {
		return (
			<View className="flex flex-1 items-center justify-center">
				<Loader2 className="animate-spin" size={35} />
			</View>
		);
	}

	if (noResults) {
		return (
			<View className="flex flex-1 items-center justify-center">
				<Text className="text-muted-foreground">No results found</Text>
				<Text className="text-muted-foreground">No results found</Text>
			</View>
		);
	}
	const imageWidthAndHeight = 100;
	const ViewCss = "border-b border-gray-400 p-1";

	return (
		<ScrollView className="flex flex-col gap-3 px-4">
			<View className="flex flex-col gap-3 pb-4">
				{children ? (
					children
				) : (
					<>
						{recents.map((recent, index) =>
							recent.type === "ARTIST" && !hide?.artists ? (
								<View className={ViewCss} key={index}>
									<ArtistItem
										onClick={() => {
											addRecent({
												id: String(recent.data.id),
												type: "ARTIST",
												data: recent.data,
											});
											onNavigate();
										}}
										artistId={String(recent.data.id)}
										initialArtist={recent.data}
										imageWidthAndHeight={imageWidthAndHeight}
									/>
								</View>
							) : recent.type === "ALBUM" && !hide?.albums ? (
								<View className={ViewCss} key={index}>
									<ResourceItem
										showType
										initialAlbum={recent.data}
										resource={{
											parentId: String(recent.data.artist?.id),
											resourceId: String(recent.data.id),
											category: "ALBUM",
										}}
										onClick={() => {
											addRecent({
												id: String(recent.data.id),
												type: "ALBUM",
												data: recent.data,
											});
											onNavigate();
										}}
										imageWidthAndHeight={imageWidthAndHeight}
									/>
								</View>
							) : recent.type === "SONG" && !hide?.songs ? (
								<View className={ViewCss} key={index}>
									<ResourceItem
										showType
										resource={{
											parentId: String(recent.data.album.id),
											resourceId: String(recent.data.id),
											category: "SONG",
										}}
										onClick={() => {
											addRecent({
												id: String(recent.data.id),
												type: "SONG",
												data: recent.data,
											});
											onNavigate();
										}}
										imageWidthAndHeight={imageWidthAndHeight}
									/>
								</View>
							) : recent.type === "PROFILE" && !hide?.profiles ? (
								<ProfileItem
									profile={recent.data}
									onClick={() => {
										addRecent({
											id: recent.data.userId,
											type: "PROFILE",
											data: recent.data,
										});
										onNavigate();
									}}
									key={index}
									isUser={myProfile!.userId === recent.data.userId}
								/>
							) : null
						)}
					</>
				)}
			</View>
		</ScrollView>
	);
};

export default SearchState;
