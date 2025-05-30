import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**", // Allows all domains (or specify a specific domain like "example.com")
			},
			{
				protocol: "http",
				hostname: "**",
			},
		],
	},
	/* config options here */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	webpack(config: any) {
		// Grab the existing rule that handles SVG imports
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const fileLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.(".svg"));

		config.module.rules.push(
			// Reapply the existing rule, but only for svg imports ending in ?url
			{
				...fileLoaderRule,
				test: /\.svg$/i,
				resourceQuery: /url/, // *.svg?url
			},
			// Convert all other *.svg imports to React components
			{
				test: /\.svg$/i,
				issuer: fileLoaderRule.issuer,
				resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
				use: ["@svgr/webpack"],
			}
		);

		// Modify the file loader rule to ignore *.svg, since we have it handled now.
		fileLoaderRule.exclude = /\.svg$/i;

		return config;
	},
};

export default nextConfig;
