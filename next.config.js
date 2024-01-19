const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
	reactStrictMode: true,
	experimental: {
		scrollRestoration: true,
	},
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "i.scdn.co",
				pathname: "/image/**",
				port: "",
			},
		],
	},
	async rewrites() {
		return [
			{
				source: "/ingest/:path*",
				destination: `${process.env.NEXT_PUBLIC_POSTHOG_HOST}/:path*`,
			},
		];
	},
});
