import { serverTrpc } from "@/app/_trpc/server";
import SongTable from "@/components/song/SongTable";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Resource } from "@/types/ratings";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import AlbumRating from "./AlbumRating";
import Reviews from "./Reviews";

type Props = {
	params: {
		albumId: string;
	};
};

export const revalidate = 60 * 60 * 24;

const Page = async ({ params: { albumId } }: Props) => {
	const album = await serverTrpc.spotify.album.query(albumId);

	const resource: Resource = {
		resourceId: albumId,
		category: "ALBUM",
	};

	return (
		<div className="flex flex-col gap-6">
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
					<div className="flex gap-3">
						<Badge variant="outline">{album.release_date}</Badge>
						{album.tracks && (
							<Badge variant="outline">
								{album.tracks.items.length} Songs
							</Badge>
						)}
					</div>
					<div className="flex items-center gap-4">
						<Suspense fallback={<Skeleton className="h-10 w-44" />}>
							<AlbumRating
								resource={resource}
								name={album.name}
							/>
						</Suspense>
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
			<Tabs
				defaultValue="songs"
				className="flex flex-col items-center sm:items-start"
			>
				<TabsList>
					<TabsTrigger value="songs">Song List</TabsTrigger>
					<TabsTrigger value="reviews">Reviews</TabsTrigger>
				</TabsList>
				<TabsContent value="songs" className="w-full pt-6">
					<SongTable songs={album.tracks?.items ?? []} />
				</TabsContent>
				<TabsContent value="reviews" className="w-full pt-8">
					<Suspense fallback={<></>}>
						<Reviews resourceId={albumId} />
					</Suspense>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Page;
