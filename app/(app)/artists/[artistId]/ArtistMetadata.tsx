"use client";

import { useDeezer } from "@/app/_api/deezer";
import { Tag } from "@/components/ui/Tag";
import Image from "next/image";

const ArtistMetadata = ({ artistId }: { artistId: string }) => {
	const { data: artist } = useDeezer({
		route: `/artist/{id}`,
		input: {
			id: artistId,
		},
	});

	return (
		<div className="flex flex-col gap-6 sm:flex-row">
			{artist.picture_big && (
				<Image
					priority
					width={250}
					height={250}
					alt={`${artist.name} cover`}
					src={artist.picture_big}
					className="w-[250px] self-center rounded-xl"
				/>
			)}
			<div className="flex flex-col items-center gap-4 sm:items-start">
				<p className="text-sm tracking-widest text-muted-foreground">
					ARTIST
				</p>
				<h1 className="text-center sm:text-left">{artist.name}</h1>
				<div className="flex flex-wrap justify-center gap-3 sm:justify-start">
					<Tag variant="outline">{artist.nb_album} Albums</Tag>
				</div>
			</div>
		</div>
	);
};

export default ArtistMetadata;
