import { getTopRated } from "@/app/_trpc/cached";
import AlbumList from "@/components/resource/album/AlbumList";

const TopRatedList = async () => {
	const top = await getTopRated();

	return <AlbumList albums={top} />;
};

export default TopRatedList;
