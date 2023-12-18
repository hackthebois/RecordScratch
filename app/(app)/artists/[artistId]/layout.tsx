import {
	getArtist,
	getArtistDiscography,
	getRatingListAverage,
} from "@/app/_trpc/cached";
import { LinkTabs } from "@/components/ui/LinkTabs";
import { Tag } from "@/components/ui/Tag";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

export async function generateMetadata({
	params: { artistId },
}: {
	params: {
		artistId: string;
	};
}): Promise<Metadata> {
	const artist = await getArtist(artistId);

	return {
		title: artist.name,
		description: artist.genres?.join(", "),
		openGraph: {
			images: artist.images?.map(({ url }) => ({ url })),
		},
	};
}

const Rating = async ({ artistId }: { artistId: string }) => {
	const albums = await getArtistDiscography(artistId);
	const rating = await getRatingListAverage(
		albums.map((album) => ({
			category: "ALBUM",
			resourceId: album.id,
		}))
	);

	return (
		<div className="flex items-center gap-2">
			<Star
				color="#ffb703"
				fill={rating?.average ? "#ffb703" : "none"}
				size={30}
			/>
			<div>
				{rating?.average && (
					<p className="text-lg font-semibold">
						{Number(rating.average).toFixed(1)}
					</p>
				)}
				<p className="flex items-center gap-1 text-sm text-muted-foreground">
					{rating?.total && Number(rating.total) !== 0
						? rating.total
						: "No ratings yet"}
				</p>
			</div>
		</div>
	);
};

const Layout = async ({
	params: { artistId },
	children,
}: {
	params: {
		artistId: string;
	};
	children: React.ReactNode;
}) => {
	const artist = await getArtist(artistId);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-6 sm:flex-row">
				{artist.images && (
					<Image
						priority
						width={250}
						height={250}
						alt={`${artist.name} cover`}
						src={artist.images[0].url}
						className="w-[250px] self-center rounded-xl"
					/>
				)}
				<div className="flex flex-col items-center gap-4 sm:items-start">
					<p className="text-sm tracking-widest text-muted-foreground">
						ARTIST
					</p>
					<h1 className="text-center sm:text-left">{artist.name}</h1>
					<div className="flex flex-wrap justify-center gap-3 sm:justify-start">
						{artist.genres?.map((genre, index) => (
							<Tag variant="outline" key={index}>
								{genre}
							</Tag>
						))}
					</div>
					<Suspense fallback={<Skeleton className="h-10 w-20" />}>
						<Rating artistId={artistId} />
					</Suspense>
				</div>
			</div>
			<LinkTabs
				tabs={[
					{
						label: "Top Songs",
						href: `/artists/${artistId}`,
					},
					{
						label: "Discography",
						href: `/artists/${artistId}/discography`,
					},
				]}
			/>
			{children}
		</div>
	);
};

export default Layout;
