import { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/albums", "/artists"],
		},
		sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
	};
};

export default robots;
