import { getAlbum, getProfile, getRecent, getSong } from "@/app/_trpc/cached";
import AlbumImage from "@/components/resource/album/AlbumImage";
import { Rating, Resource } from "@/types/rating";
import { SpotifyAlbum } from "@/types/spotify";
import { timeAgo } from "@/utils/date";
import { Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const Review = async ({
	review,
	resource,
}: {
	review: Rating;
	resource: Resource;
}) => {
	let album: SpotifyAlbum | undefined = undefined;
	let songName: string | undefined = undefined;
	if (resource.category === "ALBUM") {
		album = await getAlbum(resource.resourceId);
	} else {
		const song = await getSong(resource.resourceId);
		album = song.album;
		songName = song.name;
	}

	return (
		<div className="flex gap-4 bg-card py-4 text-card-foreground shadow-sm">
			<div className="h-20 w-20">
				<Link href={`/albums/${album.id}`}>
					<AlbumImage album={album} size={80} />
				</Link>
			</div>
			<div className="flex flex-1 flex-col gap-3">
				<div className="flex flex-1 justify-between">
					<div className="flex items-center gap-2">
						<Link href={`/albums/${album.id}`}>
							<p className="flex font-semibold">
								{songName
									? `${songName} (${album.name})`
									: album.name}
							</p>
						</Link>
						<p className="text-sm font-medium text-muted-foreground">
							•
						</p>
						<p className="text-sm font-medium text-muted-foreground">
							{timeAgo(new Date(review.updatedAt))}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-1">
					{Array.from(Array(review.rating)).map((_, i) => (
						<Star
							key={i}
							size={18}
							color="#ffb703"
							fill="#ffb703"
						/>
					))}
					{Array.from(Array(10 - review.rating)).map((_, i) => (
						<Star key={i} size={18} color="#ffb703" />
					))}
				</div>
				<p className="whitespace-pre-line text-sm">{review.content}</p>
			</div>
		</div>
	);
};

const Page = async ({
	params: { handle },
}: {
	params: {
		handle: string;
	};
}) => {
	const profile = await getProfile(handle);

	if (!profile) {
		notFound();
	}

	const recent = await getRecent(profile.userId);

	return (
		<div className="flex w-full flex-col">
			{recent.map((recent, index) => (
				<Review
					key={index}
					review={recent}
					resource={{
						category: recent.category,
						resourceId: recent.resourceId,
					}}
				/>
			))}
		</div>
	);
};

export default Page;
