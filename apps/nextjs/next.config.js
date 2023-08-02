module.exports = {
	reactStrictMode: true,
	transpilePackages: ["ui"],
	experimental: {
		serverActions: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "i.scdn.co",
				pathname: "/image/**",
				port: "",
			},
		],
	},
};
