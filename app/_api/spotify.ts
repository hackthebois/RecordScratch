import { env } from "@/env.mjs";
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
});
export type Track = z.infer<typeof TrackSchema>;

export const AlbumSchema = z.object({
	name: z.string(),
	href: z.string().url(),
	id: z.string(),
	external_urls: z.object({
		spotify: z.string().url(),
	}),
	album_type: z.enum(["album", "single", "compilation"]),
	total_tracks: z.number(),
	images: SpotifyImageSchema.array(),
	artists: ArtistSchema.array(),
	release_date: z.string(),
	tracks: z
		.object({
			items: TrackSchema.array(),
		})
		.optional(),
});
export type Album = z.infer<typeof AlbumSchema>;

export const getSpotifyToken = async () => {
	const res = await fetch("https://accounts.spotify.com/api/token", {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization:
				"Basic " +
				Buffer.from(
					env.SPOTIFY_CLIENT + ":" + env.SPOTIFY_SECRET
				).toString("base64"),
		},
		body: "grant_type=client_credentials",
		method: "POST",
		next: {
			revalidate: 60 * 59,
		},
	});
	const data = await res.json();
	return z.object({ access_token: z.string() }).parse(data).access_token;
};

const SpotifySchema = z.object({
	"/browse/new-releases": z.object({
		input: z.undefined(),
		output: z.object({
			albums: z.object({
				items: AlbumSchema.array(),
			}),
		}),
	}),
	"/search": z.object({
		input: z.object({
			q: z.string(),
			type: z.literal("album,artist").optional().default("album,artist"),
			limit: z.number(),
		}),
		output: z.object({
			albums: z.object({
				items: AlbumSchema.array(),
			}),
			artists: z.object({
				items: ArtistSchema.array(),
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
export type Spotify = z.infer<typeof SpotifySchema>;

type t = Spotify["/albums"]["input"];

export const spotify = async <TRoute extends keyof Spotify>({
	route,
	input: rawInput,
}: {
	route: TRoute;
	input: Spotify[TRoute]["input"];
}): Promise<Spotify[TRoute]["output"]> => {
	const spotifyToken = await getSpotifyToken();
	const input = SpotifySchema.shape[route].shape["input"].parse(rawInput);

	let modifiedRoute = `${route}`;
	if (input && "id" in input) {
		modifiedRoute = route.replace("{id}", input.id);
	}

	const params = new URLSearchParams(input as any);
	const url = new URL(`https://api.spotify.com/v1${modifiedRoute}`);
	url.search = params.toString();

	console.log(url.toString());

	const res = await fetch(url, {
		headers: {
			Authorization: `Bearer ${spotifyToken}`,
		},
	});
	const data: unknown = await res.json();

	if (!res.ok) {
		throw new Error(
			`Spotify API error (${route}): ${JSON.stringify(data)}`
		);
	}

	return SpotifySchema.shape[route].shape["output"].parse(data);
};
