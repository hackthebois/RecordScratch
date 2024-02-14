"use client";

import { useDeezer } from "@/app/_api/deezer";
import { Tag } from "@/components/ui/Tag";
import { formatMs } from "@/utils/date";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const AlbumMetadata = ({
	albumId,
	children,
}: {
	albumId: string;
	children: React.ReactNode;
}) => {
	const { data: album } = useDeezer({
		route: `/album/{id}`,
		input: {
			id: albumId,
		},
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
					{album.record_type?.toUpperCase()}
				</p>
				<h1 className="text-center sm:text-left">{album.title}</h1>
				<div className="flex flex-wrap justify-center gap-3 sm:justify-start">
					<Tag variant="outline">{album.release_date}</Tag>
					{album.duration && (
						<Tag variant="outline">
							{formatMs(album.duration * 1000)}
						</Tag>
					)}
					{album.genres?.data.map((genre, index) => (
						<Tag variant="outline" key={index}>
							{genre.name}
						</Tag>
					))}
				</div>
				{children}
				<Link
					href={`/artists/${album.artist?.id}`}
					className="text-muted-foreground hover:underline"
				>
					{album.artist?.name}
				</Link>
			</div>
		</div>
	);
};

export default AlbumMetadata;
