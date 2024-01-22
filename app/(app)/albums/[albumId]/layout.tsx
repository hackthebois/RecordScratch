import { getAlbum, getRating, getUserRating } from "@/app/_api";
import { RateButton } from "@/app/_auth/RateButton";
import { LinkTabs } from "@/components/ui/LinkTabs";
import { RatingInfo } from "@/components/ui/RatingInfo";
import { Tag } from "@/components/ui/Tag";
import { Skeleton } from "@/components/ui/skeleton";
import { Rating, Resource } from "@/types/rating";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export async function generateMetadata({
	params: { albumId },
}: {
	params: {
		albumId: string;
	};
}): Promise<Metadata> {
	const album = await getAlbum(albumId);
	const images = album.images.map(({ url }) => ({ url }));

	return {
		title: album.name,
		description: album.artists.map(({ name }) => name).join(", "),
		openGraph: {
			images,
			siteName: "RecordScratch",
		},
	};
}

const AlbumRatings = async ({ resource }: { resource: Resource }) => {
	const rating = await getRating(resource);

	let userRating: Rating | null = null;
	const { userId } = auth();
	if (userId) {
		userRating = await getUserRating(resource, userId);
	}

	return (
		<div className="flex items-center gap-4">
			<RatingInfo rating={rating} />
			<RateButton resource={resource} userRating={userRating} />
		</div>
	);
};

const Layout = async ({
	params: { albumId },
	children,
}: {
	params: {
		albumId: string;
	};
	children: React.ReactNode;
}) => {
	const album = await getAlbum(albumId);
	const isSingle = album.album_type === "single";

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-6 sm:flex-row sm:items-start">
				{album.images && (
					<Image
						priority
						width={250}
						height={250}
						alt={`${album.name} cover`}
						src={album.images[0].url}
						className="w-[250px] self-center rounded-xl"
					/>
				)}
				<div className="flex flex-col items-center gap-4 sm:items-start">
					<p className="text-sm tracking-widest text-muted-foreground">
						{isSingle ? "SINGLE" : "ALBUM"}
					</p>
					<h1 className="text-center sm:text-left">{album.name}</h1>
					<div className="flex flex-wrap justify-center gap-3 sm:justify-start">
						<Tag variant="outline">{album.release_date}</Tag>
						{album.tracks && !isSingle && (
							<Tag variant="outline">
								{album.tracks.items.length} Songs
							</Tag>
						)}
					</div>
					<Suspense fallback={<Skeleton className="h-10 w-40" />}>
						<AlbumRatings
							resource={{
								resourceId: albumId,
								category: "ALBUM",
							}}
						/>
					</Suspense>
					<div className="flex gap-3">
						{album.artists.map((artist, index) => (
							<Link
								href={`/artists/${artist.id}`}
								className="text-muted-foreground hover:underline"
								key={index}
								prefetch={false}
							>
								{artist.name}
							</Link>
						))}
					</div>
				</div>
			</div>
			<LinkTabs
				tabs={[
					{
						label: "Songs",
						href: `/albums/${albumId}`,
					},
					{
						label: "Reviews",
						href: `/albums/${albumId}/reviews`,
					},
				]}
			/>
			{children}
		</div>
	);
};

export default Layout;
