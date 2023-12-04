import { serverTrpc } from "@/app/_trpc/server";
import AlbumList from "@/components/AlbumList";
import Ratings, { RatingsSkeleton } from "@/components/rating/Ratings";
import SongTable from "@/components/song/SongTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { Resource } from "@/types/ratings";
import Image from "next/image";
import { Suspense } from "react";

type Props = {
	params: {
		artistId: string;
	};
};

const Artist = async ({ params: { artistId } }: Props) => {
	const artist = await serverTrpc.resource.artist.get(artistId);
	const discography = await serverTrpc.resource.artist.albums(artistId);
	const topTracks = await serverTrpc.resource.artist.topTracks(artistId);

	const resource: Resource = {
		resourceId: artistId,
		category: "ARTIST",
	};

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
							<Tag variant="outline" key={index}>
								{genre}
							</Tag>
						))}
					</div>
					<Suspense fallback={<RatingsSkeleton />}>
						<Ratings resource={resource} />
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
