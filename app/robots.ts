import { MetadataRoute } from "next";

const robots = async (): Promise<MetadataRoute.Robots> => {
	return {
		rules: {
			userAgent: "*",
			disallow: "/",
		},
		sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
	};
};

export default robots;
