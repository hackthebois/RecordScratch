import { z } from "zod";

const SpotifyImageSchema = z.object({
	url: z.string().url(),
	width: z.number(),
	height: z.number(),
});
export type SpotifyImage = z.infer<typeof SpotifyImageSchema>;

export const ArtistSchema = z.object({
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
	genres: z.string().array().optional(),
});
export type Artist = z.infer<typeof ArtistSchema>;

export const TrackSchema = z.object({
	name: z.string(),
	href: z.string().url(),
	id: z.string(),
	track_number: z.number(),
	artists: ArtistSchema.array(),
	external_urls: z.object({
		spotify: z.string().url(),
	}),
	duration_ms: z.number(),
	explicit: z.boolean(),
});
export type Track = z.infer<typeof TrackSchema>;

export const GenreSchema = z.object({
	id: z.number(),
	name: z.string(),
	picture: z.string().url(),
	picture_small: z.string().url(),
	picture_medium: z.string().url(),
	picture_big: z.string().url(),
	picture_xl: z.string().url(),
});
export type Genre = z.infer<typeof GenreSchema>;

export const AlbumSchema = z.object({
	id: z.string(),
	title: z.string(),
	url: z.string().url(),
	cover: z.string().url(),
	cover_small: z.string().url(),
	cover_medium: z.string().url(),
	cover_big: z.string().url(),
	cover_xl: z.string().url(),
	genre_id: z.number(),
	genres: GenreSchema.array(),
	label: z.string(),
	duration: z.number(),
	release_date: z.string(),
	record_type: z.string(),
	available: z.boolean(),
	tracklist: z.string().url(),
});
export type Album = z.infer<typeof AlbumSchema>;

const DeezerSchema = z.object({
	"/search": z.object({
		input: z.object({
			q: z.string(),
			limit: z.number(),
		}),
		output: z.object({
			albums: z.object({
				items: AlbumSchema.array(),
			}),
			artists: z.object({
				items: ArtistSchema.array(),
			}),
			tracks: z.object({
				items: TrackSchema.extend({
					album: AlbumSchema,
				}).array(),
			}),
		}),
	}),
	"/albums/{id}": z.object({
		input: z.object({
			id: z.string(),
		}),
		output: AlbumSchema,
	}),
	"/albums": z.object({
		input: z.object({
			ids: z.string().array(),
		}),
		output: z.object({
			albums: AlbumSchema.array(),
		}),
	}),
	"/tracks/{id}": z.object({
		input: z.object({
			id: z.string(),
		}),
		output: TrackSchema.extend({
			album: AlbumSchema,
		}),
	}),
	"/tracks": z.object({
		input: z.object({
			ids: z.string().array(),
		}),
		output: z.object({
			tracks: TrackSchema.extend({
				album: AlbumSchema,
			}).array(),
		}),
	}),
	"/artists/{id}": z.object({
		input: z.object({
			id: z.string(),
		}),
		output: ArtistSchema,
	}),
	"/artists/{id}/albums": z.object({
		input: z.object({
			id: z.string(),
			include_groups: z.literal("album,single"),
			offset: z.number().optional(),
			limit: z.number().optional(),
		}),
		output: z.object({
			items: AlbumSchema.array(),
		}),
	}),
	"/artists/{id}/top-tracks": z.object({
		input: z.object({
			id: z.string(),
			market: z.enum(["US"]).optional().default("US"),
		}),
		output: z.object({
			tracks: TrackSchema.array(),
		}),
	}),
});
export type Spotify = z.infer<typeof DeezerSchema>;

export const deezer = async <TRoute extends keyof Spotify>({
	route,
	input: rawInput,
}: {
	route: TRoute;
	input: Spotify[TRoute]["input"];
}): Promise<Spotify[TRoute]["output"]> => {
	const input = DeezerSchema.shape[route].shape["input"].parse(rawInput);

	let modifiedRoute = `${route}`;
	if (input && "id" in input) {
		modifiedRoute = route.replace("{id}", input.id);
	}

	const params = new URLSearchParams(input as any);
	const url = new URL(`https://api.deezer.com${modifiedRoute}`);
	url.search = params.toString();

	const res = await fetch(url, {
		next: {
			revalidate: 60 * 60 * 24,
		},
	});
	const data: unknown = await res.json();

	if (!res.ok) {
		throw new Error(`Deezer API error (${route}): ${JSON.stringify(data)}`);
	}

	return DeezerSchema.shape[route].shape["output"].parse(data);
};
