module.exports = {
	reactStrictMode: true,
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
