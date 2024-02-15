import { Album } from "@/utils/deezer";

const AlbumImage = ({ album, size }: { album: Album; size: number }) => {
	return (
		<div className="overflow-hidden rounded-md">
			<img
				src={album.cover_medium}
				alt={`${album.title} cover`}
				width={size}
				height={size}
				style={{
					maxWidth: size,
				}}
				className="aspect-square h-auto w-auto overflow-hidden rounded-md object-cover transition-all hover:scale-105"
			/>
		</div>
	);
};

export default AlbumImage;
