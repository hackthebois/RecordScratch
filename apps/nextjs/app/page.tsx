import Image from "next/image";
import Link from "next/link";
import { SpotifyAlbumSchema } from "../types/spotify";
import { getSpotifyToken } from "./actions";

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
		<main className="mx-auto flex max-w-screen-lg flex-1 flex-col px-4 py-8 sm:px-8">
			<h3 className="mb-8 text-xl font-bold sm:text-2xl md:text-3xl">
				New Releases
			</h3>
			<div className="grid grid-cols-2 gap-0 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
				{albums.slice(0, 12).map((album, index) => (
					<div
						key={index}
						className="flex flex-col items-center rounded p-3 transition-colors hover:bg-elevation-4"
					>
						<Link href={"/"}>
							<Image
								src={album.images[0].url}
								alt={`${album.name} cover`}
								width={0}
								height={0}
								sizes="100vw"
								style={{ width: "100%", height: "auto" }}
								className="hover mb-4 rounded"
							/>
						</Link>
						<Link
							href="/"
							className="mb-2 w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-center text-sm sm:text-base"
						>
							{album.name}
						</Link>
						{album.artists.slice(0, 1).map((artist, index) => (
							<Link
								href="/"
								className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-center text-xs text-[#ccc] hover:underline sm:text-sm"
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
