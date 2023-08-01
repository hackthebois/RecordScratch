import { z } from "zod";

export const SpotifyAlbumSchema = z.object({
	name: z.string(),
	href: z.string().url(),
	images: z
		.object({
			url: z.string(),
			height: z.number(),
			width: z.number(),
		})
		.array(),
	artists: z
		.object({
			name: z.string(),
			href: z.string().url(),
		})
		.array(),
});
