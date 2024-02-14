import { z } from "zod";

export const ArtistSchema = z.object({
	id: z.string(),
	name: z.string(),
	link: z.string().url(),
	share: z.string().url(),
	picture: z.string().url(),
	picture_small: z.string().url(),
	picture_medium: z.string().url(),
	picture_big: z.string().url(),
	picture_xl: z.string().url(),
	nb_album: z.number(),
	nb_fan: z.number(),
	radio: z.boolean(),
	tracklist: z.string().url(),
});
export type Artist = z.infer<typeof ArtistSchema>;

export const TrackSchema = z.object({
	id: z.number(),
	readable: z.boolean(),
	title: z.string(),
	title_short: z.string(),
	title_version: z.string(),
	duration: z.number(),
});
export type Track = z.infer<typeof TrackSchema>;

export const GenreSchema = z.object({
	id: z.number(),
	name: z.string(),
	picture: z.string().url().optional(),
	picture_small: z.string().url().optional(),
	picture_medium: z.string().url().optional(),
	picture_big: z.string().url().optional(),
	picture_xl: z.string().url().optional(),
});
export type Genre = z.infer<typeof GenreSchema>;

export const AlbumSchema = z.object({
	id: z.number(),
	title: z.string(),
	link: z.string().url(),
	share: z.string().url(),
	cover: z.string().url(),
	cover_small: z.string().url(),
	cover_medium: z.string().url(),
	cover_big: z.string().url(),
	cover_xl: z.string().url(),
	genre_id: z.number(),
	genres: z.object({ data: GenreSchema.array() }),
	label: z.string(),
	duration: z.number(),
	release_date: z.string(),
	record_type: z.string(),
	available: z.boolean(),
	tracklist: z.string().url(),
	explicit_lyrics: z.boolean(),
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
	"/album/{id}": z.object({
		input: z.object({
			id: z.string(),
		}),
		output: AlbumSchema.extend({
			tracks: z.object({
				data: TrackSchema.array(),
			}),
		}),
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

const getBaseUrl = () => {
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
	return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const deezer = async <TRoute extends keyof Spotify>({
	route,
	input: rawInput,
}: {
	route: TRoute;
	input: Spotify[TRoute]["input"];
}): Promise<Spotify[TRoute]["output"]> => {
	let input = DeezerSchema.shape[route].shape["input"].parse(rawInput);

	let modifiedRoute = `${route}`;
	if (input && "id" in input) {
		modifiedRoute = route.replace("{id}", input.id);
		input = {} as any;
	}

	const params = new URLSearchParams(input as any);
	const url = new URL(`${getBaseUrl()}/music${modifiedRoute}`);
	url.search = params.toString();

	const res = await fetch(url);
	const data: unknown = await res.json();

	if (!res.ok) {
		throw new Error(`Deezer API error (${route}): ${JSON.stringify(data)}`);
	}

	return DeezerSchema.shape[route].shape["output"].parse(data);
};
