import { serverTrpc } from "@/app/_trpc/server";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/Table";
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
	const album = await serverTrpc.spotify.album(albumId);
	const albumRating = await serverTrpc.album.getAlbumAverage({ albumId });
	const userRating = await serverTrpc.album.getUserRating({ albumId });
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
					<div className="flex items-center gap-3">
						<AlbumRating
							albumId={albumId}
							initialData={albumRating}
						/>
						<AlbumRatingDialog
							album={album}
							initialData={userRating}
						/>
					</div>
					<div className="mt-4 flex gap-3">
						{album.artists.map((artist, index) => (
							<Link
								href="/"
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
						<TableHead></TableHead>
						<TableHead>Song</TableHead>
						<TableHead></TableHead>
						<TableHead>Rating</TableHead>
						<TableHead></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{album.tracks?.items.map((song, index) => (
						<TableRow key={song.id}>
							<TableCell className="w-12">{index}</TableCell>
							<TableCell className="w-full whitespace-nowrap">
								{song.name}
							</TableCell>
							<TableCell>
								<SongRating
									albumId={albumId}
									songId={song.id}
									initialData={songRatings}
								/>
							</TableCell>
							<TableCell className="px-0">
								<SongRatingDialog
									song={song}
									albumId={albumId}
								/>
							</TableCell>
							<TableCell className="w-12">
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
