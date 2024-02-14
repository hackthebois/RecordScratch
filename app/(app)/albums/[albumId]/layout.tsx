import { getAlbum } from "@/app/_api";
import { Ratings } from "@/components/Ratings";
import { PathnameTabs } from "@/components/ui/LinkTabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import { Suspense } from "react";
import AlbumMetadata from "./AlbumMetadata";

export async function generateMetadata({
	params: { albumId },
}: {
	params: {
		albumId: string;
	};
}): Promise<Metadata> {
	const album = await getAlbum(albumId);

	return {
		title: album.title,
		// description: album.artists.map(({ name }) => name).join(", "),
		openGraph: {
			images: [
				album.cover,
				album.cover_small,
				album.cover_medium,
				album.cover_big,
				album.cover_xl,
			],
			siteName: "RecordScratch",
		},
	};
}

const Layout = async ({
	params: { albumId },
	children,
}: {
	params: {
		albumId: string;
	};
	children: React.ReactNode;
}) => {
	return (
		<Suspense>
			<div className="flex flex-col gap-6">
				<AlbumMetadata albumId={albumId}>
					<Suspense fallback={<Skeleton className="h-10 w-40" />}>
						<Ratings
							resource={{
								resourceId: albumId,
								category: "ALBUM",
							}}
						/>
					</Suspense>
				</AlbumMetadata>
				<PathnameTabs
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
		</Suspense>
	);
};

export default Layout;
