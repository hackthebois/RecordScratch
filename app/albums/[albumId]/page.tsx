import { serverTrpc } from "@/app/_trpc/server";
import Ratings, { RatingsSkeleton } from "@/components/rating/Ratings";
import SongTable from "@/components/song/SongTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { Resource } from "@/types/ratings";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

type Props = {
	params: {
		albumId: string;
	};
};

const Reviews = async ({
	resource: { resourceId },
}: {
	resource: Resource;
}) => {
	const reviews = await serverTrpc.resource.rating.community(resourceId);

	return (
		<div className="w-full">
			{reviews.length > 0 ? (
				reviews.map((review, index) => (
					<Card className="w-full" key={index}>
						<CardHeader className="gap-3">
							{review.title && (
								<CardTitle>{review.title}</CardTitle>
							)}
							<div className="flex gap-1">
								{Array.from(Array(review.rating)).map(
									(_, i) => (
										<Star
											key={i}
											size={20}
											color="#ffb703"
											fill="#ffb703"
										/>
									)
								)}
							</div>
						</CardHeader>
						{review.description && (
							<CardContent>{review.description}</CardContent>
						)}
						<CardFooter className="gap-3">
							<Avatar className="h-8 w-8">
								<AvatarImage src={review.user.imageUrl} />
								<AvatarFallback />
							</Avatar>
							<p>
								{review.user.firstName} {review.user.lastName}
							</p>
						</CardFooter>
					</Card>
				))
			) : (
				<p>No reviews yet</p>
			)}
		</div>
	);
};

const Page = async ({ params: { albumId } }: Props) => {
	const album = await serverTrpc.resource.album.get(albumId);

	const resource: Resource = {
		category: "ALBUM",
		resourceId: albumId,
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
						<Tag variant="outline">{album.release_date}</Tag>
						{album.tracks && (
							<Tag variant="outline">
								{album.tracks.items.length} Songs
							</Tag>
						)}
					</div>
					<div className="flex items-center gap-4">
						<Suspense fallback={<RatingsSkeleton />}>
							<Ratings resource={resource} />
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
						<Reviews resource={resource} />
					</Suspense>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Page;
