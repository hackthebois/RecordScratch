module.exports = {
	reactStrictMode: true,
	transpilePackages: ["ui"],
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
