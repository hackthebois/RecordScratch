import { z } from "zod";

export const ArtistSchema = z.object({
	id: z.number(),
	name: z.string(),
	link: z.string().url().optional(),
	share: z.string().url().optional(),
	picture: z.string().url().optional(),
	picture_small: z.string().url().optional(),
	picture_medium: z.string().url().optional(),
	picture_big: z.string().url().optional(),
	picture_xl: z.string().url().optional(),
	nb_album: z.number().optional(),
	nb_fan: z.number().optional(),
	tracklist: z.string().url(),
});
export type Artist = z.infer<typeof ArtistSchema>;

export const BaseTrackSchema = z.object({
	id: z.number(),
	readable: z.boolean(),
	title: z.string(),
	title_short: z.string(),
	title_version: z.string().optional(),
	link: z.string().url(),
	share: z.string().url().optional(),
	duration: z.number(),
	track_position: z.number().optional(),
	disk_number: z.number().optional(),
	explicit_lyrics: z.boolean(),
});

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
	cover: z.string().nullish(),
	cover_small: z.string().nullish(),
	cover_medium: z.string().nullish(),
	cover_big: z.string().nullish(),
	cover_xl: z.string().nullish(),
	genre_id: z.number().optional(),
	genres: z.object({ data: GenreSchema.array() }).optional(),
	label: z.string().optional(),
	duration: z.number().optional(),
	release_date: z.string().optional(),
	record_type: z.string().optional(),
	available: z.boolean().optional(),
	explicit_lyrics: z.boolean().optional(),
	artist: ArtistSchema.optional(),
	tracks: z.object({ data: BaseTrackSchema.array() }).optional(),
});
export type Album = z.infer<typeof AlbumSchema>;

export const TrackSchema = BaseTrackSchema.extend({
	artist: ArtistSchema,
	album: AlbumSchema,
});
export type Track = z.infer<typeof TrackSchema>;

const DeezerSchema = z.object({
	"/search/album": z.object({
		input: z.object({
			q: z.string(),
			limit: z.number().optional(),
		}),
		output: z.object({
			data: AlbumSchema.array(),
		}),
	}),
	"/search/artist": z.object({
		input: z.object({
			q: z.string(),
			limit: z.number().optional(),
		}),
		output: z.object({
			data: ArtistSchema.array(),
		}),
	}),
	"/search/track": z.object({
		input: z.object({
			q: z.string(),
			limit: z.number().optional(),
		}),
		output: z.object({
			data: TrackSchema.array(),
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
	"/album/{id}/tracks": z.object({
		input: z.object({
			id: z.string(),
			limit: z.number().optional(),
		}),
		output: z.object({
			data: TrackSchema.omit({
				album: true,
			}).array(),
			total: z.number().optional(),
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
	"/track/{id}": z.object({
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
	"/artist/{id}": z.object({
		input: z.object({
			id: z.string(),
		}),
		output: ArtistSchema,
	}),
	"/artist/{id}/albums": z.object({
		input: z.object({
			id: z.string(),
			limit: z.number().optional(),
		}),
		output: z.object({
			data: AlbumSchema.array(),
			next: z.string().url().optional(),
			total: z.number(),
		}),
	}),
	"/artist/{id}/top": z.object({
		input: z.object({
			id: z.string(),
		}),
		output: z.object({
			data: TrackSchema.array(),
			next: z.string().url().optional(),
			total: z.number(),
		}),
	}),
	"/artist/{id}/related": z.object({
		input: z.object({
			id: z.string(),
		}),
		output: z.object({
			data: ArtistSchema.array(),
			next: z.string().url().optional(),
			total: z.number(),
		}),
	}),
});
export type Deezer = z.infer<typeof DeezerSchema>;

export const deezer = async <TRoute extends keyof Deezer>({
	baseUrl,
	route,
	input: rawInput,
}: {
	baseUrl: string;
	route: TRoute;
	input: Deezer[TRoute]["input"];
}): Promise<Deezer[TRoute]["output"]> => {
	const input = DeezerSchema.shape[route].shape["input"].parse(rawInput);

	let modifiedRoute = `${route}`;
	if (input && "id" in input) {
		modifiedRoute = route.replace("{id}", input.id);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		delete (input as any).id;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const params = new URLSearchParams(input as any);

	// console.log(`${baseUrl}/music${modifiedRoute}?${params.toString()}`);

	const res = await fetch(`${baseUrl}/music${modifiedRoute}?${params.toString()}`);
	const data: unknown = await res.json();

	if (!res.ok) {
		throw new Error(`Deezer API error (${route}): input:(${input}) ${JSON.stringify(data)}`);
	}
	return DeezerSchema.shape[route].shape["output"].parse(data);
};

export const getQueryOptions = <TRoute extends keyof Deezer>({
	baseUrl,
	route,
	input,
}: {
	baseUrl: string;
	route: TRoute;
	input: Deezer[TRoute]["input"];
}) => {
	return {
		queryKey: [route, input],
		queryFn: () => {
			return deezer({ baseUrl, route, input });
		},
	};
};
