import { Button } from "@/components/ui/Button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/Table";
import { getSpotifyToken } from "app/actions";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SpotifyAlbumSchema } from "types/spotify";

type Props = {
	params: {
		albumId: string;
	};
};

const getAlbum = async (albumId: string) => {
	const token = await getSpotifyToken();

	const res = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		next: {
			revalidate: 3600,
		},
	});
	const data = await res.json();
	return SpotifyAlbumSchema.parse(data);
};

const Page = async ({ params: { albumId } }: Props) => {
	const album = await getAlbum(albumId);

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
					<div className="flex items-center">
						<Star
							color="orange"
							fill="orange"
							size={23}
							className="mr-2"
						/>
						<p className="mr-4 text-lg">{`${(
							Math.random() * 5
						).toFixed(1)} / 5`}</p>
						<Button variant="outline">
							<Star color="orange" size={18} className="mr-2" />
							Rate
						</Button>
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
						<TableHead className="text-right">Rating</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{album.tracks?.items.map((song, index) => (
						<TableRow key={song.id}>
							<TableCell className="w-12">{index}</TableCell>
							<TableCell>{song.name}</TableCell>
							<TableCell className="flex items-center justify-end">
								<Star color="orange" fill="orange" size={18} />
								<p className="w-12 text-right">{`${(
									Math.random() * 5
								).toFixed(1)} / 5`}</p>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</main>
	);
};

export default Page;
