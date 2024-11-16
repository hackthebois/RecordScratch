import { Helmet } from "react-helmet-async";

interface SeoProps {
	title: string;
	description?: string;
	keywords?: string;
	imageUrl?: string;
	path?: string;
	createdAt?: string;
	updatedAt?: string;
}

export const Seo = ({
	title,
	description,
	keywords,
	imageUrl,
	path = "/",
	createdAt,
	updatedAt,
}: SeoProps) => {
	const siteTitle = "RecordScratch";
	const fullTitle = `${title} | ${siteTitle}`;
	const canonical = `https://recordscratch.app${path}`;

	return (
		<Helmet prioritizeSeoTags>
			<title>{fullTitle}</title>
			<meta name="description" content={description || ""} />
			<meta name="keywords" content={keywords || ""} />

			{/* Open Graph Tags */}
			<meta property="og:title" content={fullTitle} />
			<meta property="og:description" content={description || ""} />
			<meta property="og:type" content="article" />
			<meta property="og:url" content={canonical} />
			{createdAt && (
				<meta property="article:published_time" content={createdAt} />
			)}
			{updatedAt && (
				<meta property="article:modified_time" content={updatedAt} />
			)}
			{imageUrl && <meta property="og:image" content={imageUrl} />}

			{/* Twitter Card Tags */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:site" content={siteTitle} />
			<meta name="twitter:creator" content={siteTitle} />
			<meta name="twitter:title" content={fullTitle} />
			<meta name="twitter:description" content={description || ""} />
			{imageUrl && <meta name="twitter:image" content={imageUrl} />}

			{/* Canonical Link */}
			<link rel="canonical" href={canonical} />
		</Helmet>
	);
};
