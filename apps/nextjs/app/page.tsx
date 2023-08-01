import Image from "next/image";
import Link from "next/link";
import { SpotifyAlbumSchema } from "../types/spotify";
import { getSpotifyToken } from "./lib/spotify";

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
		<main className="flex-1 flex flex-col max-w-screen-lg mx-auto py-8 px-4 sm:px-8">
			<h3 className="mb-8 text-xl sm:text-2xl md:text-3xl font-bold">New Releases</h3>
			<div className="grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-6 grid">
				{albums.slice(0, 12).map((album, index) => (
					<div key={index} className="flex-col flex items-center">
						<Image
							src={album.images[0].url}
							alt={`${album.name} cover`}
							width={0}
							height={0}
							sizes="100vw"
							style={{ width: "100%", height: "auto" }}
							className="rounded-xl mb-4"
						/>
						<p className="overflow-ellipsis text-center whitespace-nowrap overflow-hidden w-full mb-2">
							{album.name}
						</p>
						{album.artists.slice(0, 1).map((artist, index) => (
							<Link
								href={""}
								className="hover:underline text-[#ccc] text-sm overflow-ellipsis text-center whitespace-nowrap overflow-hidden w-full"
								key={index}
							>
								{artist.name}
							</Link>
						))}
					</div>
				))}
			</div>
		</main>
	);
};

export default Page;
