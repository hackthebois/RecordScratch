import { Album } from "@/app/_api/deezer";
import Image from "next/image";

const AlbumImage = ({ album, size }: { album: Album; size: number }) => {
	return (
		<div className="overflow-hidden rounded-md">
			<Image
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
