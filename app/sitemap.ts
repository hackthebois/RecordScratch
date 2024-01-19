import { MetadataRoute } from "next";
import { staticTrpc } from "../trpc/server";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
	const albums = await staticTrpc.resource.album.getUniqueIds();
	const profiles = await staticTrpc.user.profile.getUniqueHandles();

	const albumMap: MetadataRoute.Sitemap = albums.flatMap((albumId) => {
		return [
			{
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/albums/${albumId}`,
				lastModified: new Date(),
				changeFrequency: "weekly",
				priority: 0.8,
			},
			{
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/albums/${albumId}/reviews`,
				lastModified: new Date(),
				changeFrequency: "daily",
				priority: 0.5,
			},
		];
	});

	const profileMap: MetadataRoute.Sitemap = profiles.flatMap((handle) => {
		return [
			{
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/users/${handle}`,
				lastModified: new Date(),
				changeFrequency: "daily",
				priority: 0.8,
			},
		];
	});

	return [
		{
			url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		...albumMap,
		...profileMap,
	];
};

export default sitemap;
