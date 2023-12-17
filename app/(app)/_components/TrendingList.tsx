import { getTrending } from "@/app/_trpc/cached";
import AlbumList from "@/components/resource/album/AlbumList";

const TrendingList = async () => {
	const trending = await getTrending();

	return <AlbumList albums={trending} />;
};

export default TrendingList;
