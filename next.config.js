const { withAxiom } = require("next-axiom");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(
	withAxiom({
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
		// logging: {
		// 	fetches: {
		// 		fullUrl: true,
		// 	},
		// },
	})
);
