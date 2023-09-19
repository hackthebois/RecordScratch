import { Button } from "@/components/ui/Button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/Table";
import { getAlbum } from "@/server/spotify";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import RatingDialog from "./RatingDialog";
import SongActions from "./SongActions";

type Props = {
	params: {
		albumId: string;
	};
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
						<RatingDialog name={album.name} albumId={albumId}>
							<Button variant="outline">
								<Star
									color="orange"
									size={18}
									className="mr-2"
								/>
								Rate
							</Button>
						</RatingDialog>
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
							<TableCell className="px-0">
								<RatingDialog
									name={song.name}
									albumId={"songId"}
								>
									<Button variant="ghost" size="sm">
										<Star
											color="orange"
											size={18}
											className="mr-2"
										/>
										Rate
									</Button>
								</RatingDialog>
							</TableCell>
							<TableCell>
								<span className="flex items-center">
									<Star
										color="orange"
										fill="orange"
										size={18}
									/>
									<p className="w-12 text-right">{`${(
										Math.random() * 5
									).toFixed(1)} / 5`}</p>
								</span>
							</TableCell>
							<TableCell className="w-12">
								<SongActions song={song} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</main>
	);
};

export default Page;
