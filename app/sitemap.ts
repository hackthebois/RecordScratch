import { db } from "@/server/db/db";
import { profile } from "@/server/db/schema";
import { MetadataRoute } from "next";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
	const handles = await db
		.select({
			handle: profile.handle,
		})
		.from(profile)
		.groupBy(profile.handle);

	return [
		{
			url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		...handles.map(
			({ handle }) =>
				({
					url: `${process.env.NEXT_PUBLIC_SITE_URL}/users/${handle}`,
					lastModified: new Date(),
					changeFrequency: "daily",
					priority: 0.8,
				} satisfies MetadataRoute.Sitemap[0])
		),
	];
};

export default sitemap;
