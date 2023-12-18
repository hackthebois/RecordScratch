import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
	];
}
