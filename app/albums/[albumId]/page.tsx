import { serverTrpc } from "@/app/_trpc/server";
import SongTable from "@/components/SongTable";
import { RatingCategory } from "@/drizzle/db/schema";
import { getRatings } from "@/utils/ratings";
import Image from "next/image";
import Link from "next/link";
import AlbumRating from "./AlbumRating";

type Props = {
	params: {
		albumId: string;
	};
};

const Page = async ({ params: { albumId } }: Props) => {
	const album = await serverTrpc.spotify.album(albumId);

	const resource = {
		resourceId: albumId,
		type: RatingCategory.ALBUM,
	};

	const ratings = await getRatings(resource);

	return (
		<main className="mx-auto flex max-w-screen-lg flex-1 flex-col gap-12 overflow-hidden px-4 py-8 sm:px-8">
			<div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
				{album.images && (
					<Image
						width={200}
						height={200}
						alt={`${album.name} cover`}
						src={album.images[0].url}
						className="rounded-xl"
					/>
				)}
				<div className="flex flex-col items-center gap-4 sm:items-start">
					<div className="flex flex-col items-center gap-1 sm:items-start">
						<p className="text-sm tracking-widest text-muted-foreground">
							ALBUM
						</p>
						<h1 className="text-center sm:text-left">
							{album.name}
						</h1>
					</div>
					<div className="flex items-center gap-4">
						<AlbumRating resource={resource} ratings={ratings} />
					</div>
					<div className="flex gap-3">
						{album.artists.map((artist, index) => (
							<Link
								href={`/artists/${artist.id}`}
								className="text-muted-foreground hover:underline"
								key={index}
							>
								{artist.name}
							</Link>
						))}
					</div>
				</div>
			</div>
			{album.tracks && <SongTable songs={album.tracks.items} />}
		</main>
	);
};

export default Page;
