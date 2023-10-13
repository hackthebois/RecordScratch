import { serverTrpc } from "@/app/_trpc/server";
import AlbumList from "@/components/album/AlbumList";
import { Rating } from "@/components/rating/Rating";
import SongTable from "@/components/song/SongTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import { Suspense } from "react";

type Props = {
	params: {
		artistId: string;
	};
};

const ArtistRating = async (input: { id: string; albums: string[] }) => {
	const rating = await serverTrpc.rating.getEveryAlbumAverage.query(input);

	return <Rating rating={rating} emptyText="No ratings yet" />;
};

const ArtistRatingSkeleton = () => {
	return <Skeleton className="h-10 w-20" />;
};

const Artist = async ({ params: { artistId } }: Props) => {
	const [artist, discography, topTracks] = await unstable_cache(
		async () => {
			return await Promise.all([
				serverTrpc.spotify.artist.findOne.query(artistId),
				serverTrpc.spotify.artist.albums.query(artistId),
				serverTrpc.spotify.artist.topTracks.query(artistId),
			]);
		},
		[artistId],
		{ revalidate: 60 * 60 }
	)();

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
				{artist.images && (
					<Image
						width={200}
						height={200}
						alt={`${artist.name} cover`}
						src={artist.images[0].url}
						className="rounded-xl"
					/>
				)}
				<div className="flex flex-col items-center gap-4 sm:items-start">
					<div className="flex flex-col items-center gap-1 sm:items-start">
						<p className="text-sm tracking-widest text-muted-foreground">
							ARTIST
						</p>
						<h1 className="text-center sm:text-left">
							{artist.name}
						</h1>
					</div>
					<div className="flex flex-wrap justify-center gap-3">
						{artist.genres?.map((genre, index) => (
							<Badge variant="outline" key={index}>
								{genre}
							</Badge>
						))}
					</div>
					<Suspense fallback={<ArtistRatingSkeleton />}>
						<ArtistRating
							id={artistId}
							albums={discography.map((album) => album.id)}
						/>
					</Suspense>
				</div>
			</div>
			<Tabs
				defaultValue="top-tracks"
				className="flex flex-col items-center sm:items-start"
			>
				<TabsList>
					<TabsTrigger value="top-tracks">Popular Songs</TabsTrigger>
					<TabsTrigger value="discography">Discography</TabsTrigger>
				</TabsList>
				<TabsContent value="top-tracks" className="w-full pt-6">
					<SongTable songs={topTracks} />
				</TabsContent>
				<TabsContent value="discography" className="pt-8">
					<AlbumList albums={discography} type="wrap" field="date" />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Artist;
