const { withAxiom } = require("next-axiom");

module.exports = withAxiom({
	reactStrictMode: true,
	experimental: {
		serverActions: true,
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
});
