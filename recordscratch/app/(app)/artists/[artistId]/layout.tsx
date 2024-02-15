import { getArtist } from "@/recordscratch/app/_api";
import { PathnameTabs } from "@/recordscratch/components/ui/LinkTabs";
import { Metadata } from "next";
import ArtistMetadata from "./ArtistMetadata";

export async function generateMetadata({
	params: { artistId },
}: {
	params: {
		artistId: string;
	};
}): Promise<Metadata> {
	const artist = await getArtist(artistId);

	const images = [
		artist.picture,
		artist.picture_small,
		artist.picture_medium,
		artist.picture_big,
		artist.picture_xl,
	].filter(Boolean) as string[];

	return {
		title: artist.name,
		openGraph: {
			images,
			siteName: "RecordScratch",
		},
	};
}

const Layout = async ({
	params: { artistId },
	children,
}: {
	params: {
		artistId: string;
	};
	children: React.ReactNode;
}) => {
	return (
		<div className="flex flex-col gap-6">
			<ArtistMetadata artistId={artistId} />
			<PathnameTabs
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
