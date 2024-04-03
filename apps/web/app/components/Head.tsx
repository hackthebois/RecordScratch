import { Helmet } from "react-helmet-async";
export const Head = ({
	title,
	description,
}: {
	title: string;
	description?: string;
}) => {
	return (
		<Helmet>
			<title>{title} | RecordScratch</title>
			<meta name="description" content={description} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
		</Helmet>
	);
};
