import { ArtistItem } from "./ArtistItem";
import { ProfileItem } from "./ProfileItem";
import { ResourceItem } from "./ResourceItem";
import { useRecents } from "@recordscratch/lib";
import { Loader2 } from "lucide-react-native";
import { ScrollView } from "react-native";
import { View } from "react-native-ui-lib";
import { Text } from "./Text";

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
	const { recents, addRecent } = useRecents("SEARCH");

	if (isError) {
		return (
			<View className="flex flex-1 items-center justify-center">
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
			</View>
		);
	}
	const ImageCss = "h-20 w-20 mb-1";
	const ViewCss = "border-b border-gray-400 ";

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
										imageCss={ImageCss}
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
										imageCss={ImageCss}
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
										imageCss={ImageCss}
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
