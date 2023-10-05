import { cn } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import { SpotifyAlbum } from "../types/spotify";
import { serverTrpc } from "./_trpc/server";

const AlbumList = ({ albums }: { albums: SpotifyAlbum[] }) => {
	return (
		<div className="flex w-full gap-4 overflow-hidden overflow-x-auto">
			{albums.slice(0, 6).map((album, index) => (
				<div
					className="mb-4 flex min-w-[144px] flex-1 flex-col"
					key={index}
				>
					<Link href={`/album/${album.id}`}>
						<div className="overflow-hidden rounded-md">
							<Image
								src={album.images[0].url}
								alt={`${album.name} cover`}
								width={144}
								height={144}
								className={cn(
									"aspect-square h-auto w-auto object-cover transition-all hover:scale-105"
								)}
							/>
						</div>
						<p className="mb-1 mt-2 truncate text-sm">
							{album.name}
						</p>
					</Link>
					{album.artists.slice(0, 1).map((artist, index) => (
						<Link
							href={`/artist/${artist.id}`}
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
	const newReleases = await serverTrpc.spotify.new();

	return (
		<main className="mx-auto flex max-w-screen-lg flex-1 flex-col overflow-hidden px-4 py-8 sm:px-8">
			<h2 className="mb-6">New Releases</h2>
			<AlbumList albums={newReleases} />
		</main>
	);
};

export default Page;
