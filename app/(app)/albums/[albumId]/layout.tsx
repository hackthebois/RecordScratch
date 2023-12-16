import { getAlbum } from "@/app/_trpc/cached";
import { Ratings, RatingsSkeleton } from "@/components/Ratings";
import { LinkTabs } from "@/components/ui/LinkTabs";
import { Tag } from "@/components/ui/Tag";
import { Resource } from "@/types/rating";
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
						className="w-[250px] self-center rounded-xl"
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
					<Suspense fallback={<RatingsSkeleton />}>
						<Ratings resource={resource} name={album.name} />
					</Suspense>
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
