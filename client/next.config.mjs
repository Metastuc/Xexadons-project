/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config) => {
		config.externals.push("pino-pretty", "lokijs", "encoding");
		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "raw.seadn.io",
			},
			{
				protocol: "https",
				hostname: "firebasestorage.googleapis.com",
			},
		],
	},
};

export default nextConfig;
