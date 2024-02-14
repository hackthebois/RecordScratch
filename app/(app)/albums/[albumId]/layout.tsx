import { getAlbum } from "@/app/_api";
import { PathnameTabs } from "@/components/ui/LinkTabs";
import { Metadata } from "next";
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
		<div className="flex flex-col gap-6">
			<AlbumMetadata albumId={albumId} />
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
	);
};

export default Layout;
