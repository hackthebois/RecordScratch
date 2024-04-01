import { Album } from "@recordscratch/utils";

const AlbumImage = ({ album }: { album: Album }) => {
	return (
		<div className="w-full overflow-hidden rounded-md">
			<img
				src={album.cover_medium ?? ""}
				alt={`${album.title} cover`}
				className="aspect-square h-auto w-auto overflow-hidden rounded-md object-cover transition-all hover:scale-105"
			/>
		</div>
	);
};

export default AlbumImage;
