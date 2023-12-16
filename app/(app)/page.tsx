import UserAvatar from "@/components/UserAvatar";
import AlbumImage from "@/components/resource/album/AlbumImage";
import AlbumList from "@/components/resource/album/AlbumList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Profile } from "@/types/profile";
import { Rating, Resource } from "@/types/rating";
import { SpotifyAlbum } from "@/types/spotify";
import { timeAgo } from "@/utils/date";
import { Star } from "lucide-react";
import Link from "next/link";
import {
	getAlbum,
	getFeed,
	getNewReleases,
	getSong,
	getTopRated,
	getTrending,
} from "../_trpc/cached";

const Review = async ({
	review,
	resource,
}: {
	review: Rating & {
		profile: Profile;
	};
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
				<Link
					href={`/${review.profile.handle}`}
					className="mt-1 flex items-center gap-2"
				>
					<UserAvatar {...review.profile} size={30} />
					<p className="flex">{review.profile.name}</p>
				</Link>
				<p className="whitespace-pre-line text-sm">{review.content}</p>
			</div>
		</div>
	);
};

const Page = async () => {
	const newReleases = await getNewReleases();
	const trending = await getTrending();
	const top = await getTopRated();
	const feed = await getFeed();

	return (
		<div className="w-full">
			<Tabs defaultValue="new">
				<div className="mt-[2vh] flex justify-between">
					<h2 className="mb-4">This Week</h2>
					<TabsList className="mb-2">
						<TabsTrigger value="new">New</TabsTrigger>
						<TabsTrigger value="trending">Trending</TabsTrigger>
						<TabsTrigger value="top">Top Rated</TabsTrigger>
					</TabsList>
				</div>
				<TabsContent value="new">
					<AlbumList albums={newReleases} />
				</TabsContent>
				<TabsContent value="trending">
					<AlbumList albums={trending} />
				</TabsContent>
				<TabsContent value="top">
					<AlbumList albums={top} />
				</TabsContent>
				<h2 className="mb-2 mt-[2vh]">Feed</h2>
				{feed.map((review, index) => (
					<Review
						key={index}
						review={review}
						resource={{
							category: review.category,
							resourceId: review.resourceId,
						}}
					/>
				))}
			</Tabs>
		</div>
	);
};

export default Page;
