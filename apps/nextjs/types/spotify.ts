import { z } from "zod";

const SpotifyImageSchema = z.object({
	url: z.string().url(),
	width: z.number(),
	height: z.number(),
});
export type SpotifyImage = z.infer<typeof SpotifyImageSchema>;

export const SpotifyArtistSchema = z.object({
	id: z.string(),
	followers: z
		.object({
			total: z.number(),
		})
		.optional(),
	external_urls: z.object({
		spotify: z.string().url(),
	}),
	name: z.string(),
	images: SpotifyImageSchema.array().optional(),
});
export type SpotifyArtist = z.infer<typeof SpotifyArtistSchema>;

export const SpotifyTrackSchema = z.object({
	name: z.string(),
	href: z.string().url(),
	id: z.string(),
	artists: SpotifyArtistSchema.array(),
	duration_ms: z.number(),
});
export type SpotifyTrack = z.infer<typeof SpotifyTrackSchema>;

export const SpotifyAlbumSchema = z.object({
	name: z.string(),
	href: z.string().url(),
	id: z.string(),
	external_urls: z.object({
		spotify: z.string().url(),
	}),
	total_tracks: z.number(),
	images: SpotifyImageSchema.array(),
	artists: SpotifyArtistSchema.array(),
	tracks: z
		.object({
			items: SpotifyTrackSchema.array(),
		})
		.optional(),
});
export type SpotifyAlbum = z.infer<typeof SpotifyAlbumSchema>;
