import { getUrl } from "@/utils/url";
import { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/albums", "/artists"],
		},
		sitemap: `${getUrl()}/sitemap.xml`,
	};
};

export default robots;
