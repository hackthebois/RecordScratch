import { serverTrpc } from "@/app/_trpc/server";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/Table";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import {
	AlbumRating,
	AlbumRatingDialog,
	SongRating,
	SongRatingDialog,
} from "./Ratings";
import SongActions from "./SongActions";

type Props = {
	params: {
		albumId: string;
	};
};

const Page = async ({ params: { albumId } }: Props) => {
	const { userId } = auth();

	let albumUserRating: AlbumRating | null = null;

	const album = await serverTrpc.spotify.album(albumId);
	const albumRating = await serverTrpc.album.getAlbumAverage({ albumId });
	if (userId) {
		albumUserRating = await serverTrpc.album.getUserRating({ albumId });
	}
	const songRatings = await serverTrpc.song.getAllAverageSongRatings({
		albumId,
	});

	return (
		<main className="mx-auto flex max-w-screen-lg flex-1 flex-col overflow-hidden px-4 py-8 sm:px-8">
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
				<div className="flex flex-col items-center sm:items-start">
					<h1 className="mb-6 text-center sm:text-left">
						{album.name}
					</h1>
					<div className="flex items-center gap-4">
						<AlbumRating
							albumId={albumId}
							initialData={albumRating}
						/>
						<AlbumRatingDialog
							album={album}
							initialData={albumUserRating}
						/>
					</div>
					<div className="mt-4 flex gap-3">
						{album.artists.map((artist, index) => (
							<Link
								href={`/artist/${artist.id}`}
								className="text-muted-foreground hover:underline"
								key={index}
							>
								{artist.name}
							</Link>
						))}
					</div>
				</div>
			</div>
			<Table className="mt-10">
				<TableHeader>
					<TableRow>
						<TableHead className="pl-4 pr-0">#</TableHead>
						<TableHead>Song</TableHead>
						<TableHead className="p-0">Rating</TableHead>
						<TableHead></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{album.tracks?.items.map((song, index) => (
						<TableRow key={song.id}>
							<TableCell className="p-0 text-right text-muted-foreground">
								{index + 1}
							</TableCell>
							<TableCell className="w-full whitespace-nowrap">
								{song.name}
							</TableCell>
							<TableCell className="flex flex-row-reverse gap-4 px-0">
								<SongRatingDialog
									song={song}
									albumId={albumId}
								/>
								<SongRating
									albumId={albumId}
									songId={song.id}
									initialData={songRatings}
								/>
							</TableCell>
							<TableCell>
								<SongActions song={song} albumId={albumId} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</main>
	);
};

export default Page;
