"use client";

import { useDeezer } from "@/app/_api/deezer";
import { buttonVariants } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { formatMs } from "@/utils/date";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SongMetadata = ({
	songId,
	children,
}: {
	songId: string;
	children: React.ReactNode;
}) => {
	const { data: song } = useDeezer({
		route: `/track/{id}`,
		input: {
			id: songId,
		},
	});
	const album = song.album;

	return (
		<div className="flex flex-col gap-6 sm:flex-row sm:items-start">
			{song.album.cover_big && (
				<Image
					priority
					width={250}
					height={250}
					alt={`${song.album.title} cover`}
					src={song.album.cover_big}
					className="w-[250px] self-center rounded-xl"
				/>
			)}
			<div className="flex flex-col items-center gap-4 sm:items-start">
				<p className="text-sm tracking-widest text-muted-foreground">
					SONG
				</p>
				<h1 className="text-center sm:text-left">{song.title}</h1>
				<div className="flex flex-wrap justify-center gap-3 sm:justify-start">
					<Tag variant="outline">{album.release_date}</Tag>
					{song.explicit_lyrics && (
						<Tag variant="outline">Explicit</Tag>
					)}
					<Tag variant="outline">
						{formatMs(song.duration * 1000)}
					</Tag>
				</div>
				{children}
				<Link
					href={`/albums/${album.id}`}
					className={buttonVariants({
						size: "sm",
						variant: "secondary",
					})}
				>
					Go to album
				</Link>
			</div>
		</div>
	);
};

export default SongMetadata;
