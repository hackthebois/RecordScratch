"use client";

import { deezer } from "@/app/_api/deezer";
import { Tag } from "@/components/ui/Tag";
import { formatMs } from "@/utils/date";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";

export const AlbumMetadata = ({ albumId }: { albumId: string }) => {
	const { data: album } = useSuspenseQuery({
		queryKey: ["album", albumId],
		queryFn: () =>
			deezer({
				route: `/album/{id}`,
				input: {
					id: albumId,
				},
			}),
	});

	if (!album) {
		return null;
	}

	return (
		<div className="flex flex-col gap-6 sm:flex-row sm:items-start">
			<Image
				priority
				width={250}
				height={250}
				alt={`${album.title} cover`}
				src={album.cover_big}
				className="w-[250px] self-center rounded-xl"
			/>
			<div className="flex flex-col items-center gap-4 sm:items-start">
				<p className="text-sm tracking-widest text-muted-foreground">
					{album.record_type.toUpperCase()}
				</p>
				<h1 className="text-center sm:text-left">{album.title}</h1>
				<div className="flex flex-wrap justify-center gap-3 sm:justify-start">
					<Tag variant="outline">{album.release_date}</Tag>
					<Tag variant="outline">
						{formatMs(album.duration * 1000)}
					</Tag>
					{album.genres.data.map((genre, index) => (
						<Tag variant="outline" key={index}>
							{genre.name}
						</Tag>
					))}
				</div>
				{/* <Suspense fallback={<Skeleton className="h-10 w-40" />}>
					<Ratings
						resource={{
							resourceId: albumId,
							category: "ALBUM",
						}}
					/>
				</Suspense> */}
				{/* <div className="flex gap-3">
					{album..map((artist, index) => (
						<Link
							href={`/artists/${artist.id}`}
							className="text-muted-foreground hover:underline"
							key={index}
							prefetch={false}
						>
							{artist.name}
						</Link>
					))}
				</div> */}
			</div>
		</div>
	);
};

export default AlbumMetadata;
