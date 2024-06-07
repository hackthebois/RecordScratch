import { ResourceItem } from "./ResourceItem";
import { deezer } from "../utils/deezer";
import { useRecents } from "@recordscratch/lib";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native-ui-lib";
import SearchState from "./SearchState";

const AlbumSearch = ({ query, onNavigate }: { query: string; onNavigate: () => void }) => {
	const { addRecent } = useRecents("SEARCH");

	const { data, isLoading, isError } = useQuery({
		queryKey: ["search", query],
		queryFn: async () => {
			return (
				await deezer({
					route: "/search/album",
					input: { q: query, limit: 10 },
				})
			).data;
		},
		refetchOnMount: false,
		enabled: query.length > 0,
	});
	const ImageCss = "h-20 w-20 mb-2";

	return (
		<SearchState
			isError={isError}
			isLoading={isLoading}
			onNavigate={onNavigate}
			noResults={data?.length === 0}
			hide={{ profiles: true, artists: true, songs: true }}
		>
			{data && data.length && (
				<>
					{data.map((album, index) => (
						<View className=" border-b border-gray-400" key={index}>
							<ResourceItem
								initialAlbum={album}
								resource={{
									parentId: String(album.artist?.id),
									resourceId: String(album.id),
									category: "ALBUM",
								}}
								onClick={() => {
									addRecent({
										id: String(album.id),
										type: "ALBUM",
										data: album,
									});
									onNavigate();
								}}
								imageCss={ImageCss}
								showType={true}
							/>
						</View>
					))}
				</>
			)}
		</SearchState>
	);
};

export default AlbumSearch;
