import { getArtist } from "@/app/_trpc/cached";
import { Ratings, RatingsSkeleton } from "@/components/Ratings";
import { Tabs } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { Resource } from "@/types/ratings";
import Image from "next/image";
import { Suspense } from "react";

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

	const resource: Resource = {
		resourceId: artistId,
		category: "ARTIST",
	};

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
						className="w-full rounded-xl sm:w-[250px]"
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
					<Suspense fallback={<RatingsSkeleton />}>
						<Ratings resource={resource} name={artist.name} />
					</Suspense>
				</div>
			</div>
			<Tabs
				tabs={[
					{
						label: "Top Songs",
						href: `/artists/${artistId}/top-songs`,
					},
					{
						label: "Discography",
						href: `/artists/${artistId}/discography`,
					},
					{
						label: "Reviews",
						href: `/artists/${artistId}/reviews`,
					},
				]}
			/>
			{children}
		</div>
	);
};

export default Layout;
