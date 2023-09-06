import Image from "next/image";
import Link from "next/link";
import { SpotifyAlbum, SpotifyAlbumSchema } from "../types/spotify";
import { getSpotifyToken } from "./actions";

const AlbumList = ({ albums }: { albums: SpotifyAlbum[] }) => {
	return (
		<div className="flex w-full gap-4 overflow-hidden overflow-x-auto">
			{albums.slice(0, 6).map((album, index) => (
				<div
					className="mb-4 flex min-w-[144px] flex-1 flex-col items-center"
					key={index}
				>
					<Link href={"/"}>
						<Image
							src={album.images[0].url}
							alt={`${album.name} cover`}
							width={144}
							height={144}
							className="mb-4 rounded"
						/>
						<p className="mb-2 overflow-hidden overflow-ellipsis text-center text-sm">
							{album.name}
						</p>
					</Link>
					{album.artists.slice(0, 1).map((artist, index) => (
						<Link
							href="/"
							className="text-xs text-muted-foreground hover:underline"
							key={index}
						>
							{artist.name}
						</Link>
					))}
				</div>
			))}
		</div>
	);
};

const Page = async () => {
	const token = await getSpotifyToken();

	const res = await fetch("https://api.spotify.com/v1/browse/new-releases", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		next: {
			revalidate: 3600,
		},
	});
	const data = await res.json();

	const albums = SpotifyAlbumSchema.array().parse(data.albums.items);

	return (
		<main className="mx-auto flex max-w-screen-lg flex-1 flex-col overflow-hidden px-4 py-8 sm:px-8">
			<h2 className="mb-6">New Releases</h2>
			<AlbumList albums={albums} />
		</main>
	);
};

export default Page;
