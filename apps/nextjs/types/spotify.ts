import { z } from "zod";

const SpotifyImageSchema = z.object({
	url: z.string().url(),
	width: z.number(),
	height: z.number(),
});
type SpotifyImage = z.infer<typeof SpotifyImageSchema>;

export const SpotifyArtistSchema = z.object({
	id: z.string(),
	followers: z.object({
		total: z.number(),
	}),
	external_urls: z.object({
		spotify: z.string().url(),
	}),
	name: z.string(),
	images: SpotifyImageSchema.array(),
});
export type SpotifyArtist = z.infer<typeof SpotifyArtistSchema>;

export const SpotifyAlbumSchema = z.object({
	name: z.string(),
	href: z.string().url(),
	images: SpotifyImageSchema.array(),
	artists: z
		.object({
			external_urls: SpotifyArtistSchema.shape.external_urls,
			name: SpotifyArtistSchema.shape.name,
			id: SpotifyArtistSchema.shape.id,
		})
		.array(),
});
export type SpotifyAlbum = z.infer<typeof SpotifyAlbumSchema>;
