import { db } from "@/recordscratch/server/db";
import { profile } from "@/recordscratch/server/db/schema";
import { getUrl } from "@/recordscratch/utils/url";
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
			url: `${getUrl()}/`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		...handles.map(
			({ handle }) =>
				({
					url: `${getUrl()}/users/${handle}`,
					lastModified: new Date(),
					changeFrequency: "daily",
					priority: 0.8,
				} satisfies MetadataRoute.Sitemap[0])
		),
	];
};

export default sitemap;
