import { getAlbum } from "@/app/(app)/albums/_trpc/cached";
import { Ratings, RatingsSkeleton } from "@/components/Ratings";
import { Tabs } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { Resource } from "@/types/ratings";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

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

	const resource: Resource = {
		category: "ALBUM",
		resourceId: albumId,
	};

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
						className="w-full rounded-xl sm:w-[250px]"
					/>
				)}
				<div className="flex flex-col items-center gap-4 sm:items-start">
					<p className="text-sm tracking-widest text-muted-foreground">
						ALBUM
					</p>
					<h1 className="text-center sm:text-left">{album.name}</h1>
					<div className="flex flex-wrap justify-center gap-3 sm:justify-start">
						<Tag variant="outline">{album.release_date}</Tag>
						{album.tracks && (
							<Tag variant="outline">
								{album.tracks.items.length} Songs
							</Tag>
						)}
					</div>
					<div className="flex gap-4">
						<Suspense fallback={<RatingsSkeleton />}>
							<Ratings resource={resource} name={album.name} />
						</Suspense>
					</div>
					<div className="flex gap-3">
						{album.artists.map((artist, index) => (
							<Link
								href={`/artists/${artist.id}/top-songs`}
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
				tabs={[
					{
						label: "Songs",
						href: `/albums/${albumId}/songs`,
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
