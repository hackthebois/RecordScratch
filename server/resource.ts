import { env } from "@/env.mjs";
import { ratings } from "@/server/db/schema";
import { ResourceSchema } from "@/types/ratings";
import { UserDTOSchema } from "@/types/users";
import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { and, avg, count, eq, inArray, isNotNull } from "drizzle-orm";
import {
	SpotifyAlbumSchema,
	SpotifyArtistSchema,
	SpotifyTrackSchema,
} from "types/spotify";
import { z } from "zod";
import { publicProcedure, router } from "./trpc";

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
		cache: "no-store",
		body: "grant_type=client_credentials",
		method: "POST",
	});
	const data = await res.json();
	return z.object({ access_token: z.string() }).parse(data).access_token;
};

const spotifyFetch = async (url: string) => {
	const spotifyToken = await getSpotifyToken();

	const res = await fetch(`https://api.spotify.com/v1${url}`, {
		headers: {
			Authorization: `Bearer ${spotifyToken}`,
		},
	});

	if (!res.ok) {
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Spotify API Error",
		});
	}

	const data: unknown = await res.json();
	return { data, res };
};

export const resourceRouter = router({
	rating: router({
		get: publicProcedure
			.input(ResourceSchema)
			.query(async ({ ctx: { db }, input: { resourceId, category } }) => {
				const rating = await db
					.select({
						average: avg(ratings.rating),
						total: count(ratings.rating),
					})
					.from(ratings)
					.where(
						and(
							eq(ratings.resourceId, resourceId),
							eq(ratings.category, category)
						)
					);
				return rating.length ? { ...rating[0], resourceId } : null;
			}),
		getList: publicProcedure
			.input(ResourceSchema.array())
			.query(async ({ ctx: { db }, input: resources }) => {
				return await db
					.select({
						average: avg(ratings.rating),
						total: count(ratings.rating),
						resourceId: ratings.resourceId,
					})
					.from(ratings)
					.where(
						inArray(
							ratings.resourceId,
							resources.map((r) => r.resourceId)
						)
					)
					.groupBy(ratings.resourceId);
			}),
		community: publicProcedure
			.input(ResourceSchema)
			.query(async ({ ctx: { db }, input: { resourceId, category } }) => {
				const commmunityRatings = await db.query.ratings.findMany({
					where: and(
						eq(ratings.resourceId, resourceId),
						eq(ratings.category, category),
						isNotNull(ratings.content)
					),
					limit: 10,
					// TODO: order by date, and paginate
				});
				const users = await clerkClient.users.getUserList({
					userId: commmunityRatings.map((r) => r.userId),
				});

				return commmunityRatings.map((rating) => {
					const user = users.find(
						(user) => user.id === rating.userId
					);
					return {
						...rating,
						user: UserDTOSchema.optional().parse(user),
					};
				});
			}),
	}),
	search: publicProcedure
		.input(z.string().min(1))
		.query(async ({ input: q }) => {
			const { data } = await spotifyFetch(
				`/search?q=${q}&type=album,artist&limit=4`
			);
			return z
				.object({
					albums: z.object({ items: SpotifyAlbumSchema.array() }),
					artists: z.object({
						items: SpotifyArtistSchema.array(),
					}),
				})
				.parse(data);
		}),
	album: router({
		get: publicProcedure
			.input(z.string())
			.query(async ({ input: albumId }) => {
				const { data } = await spotifyFetch(`/albums/${albumId}`);
				return SpotifyAlbumSchema.parse(data);
			}),
		newReleases: publicProcedure.query(async () => {
			const { data } = await spotifyFetch("/browse/new-releases");
			return z
				.object({
					albums: z.object({ items: SpotifyAlbumSchema.array() }),
				})
				.parse(data).albums.items;
		}),
	}),
	artist: router({
		get: publicProcedure
			.input(z.string())
			.query(async ({ input: artistId }) => {
				const { data } = await spotifyFetch(`/artists/${artistId}`);
				return SpotifyArtistSchema.parse(data);
			}),
		albums: publicProcedure
			.input(z.string())
			.query(async ({ input: artistId }) => {
				const { data } = await spotifyFetch(
					`/artists/${artistId}/albums`
				);
				return z
					.object({
						items: SpotifyAlbumSchema.array(),
					})
					.parse(data).items;
			}),
		topTracks: publicProcedure
			.input(z.string())
			.query(async ({ input: artistId }) => {
				const { data } = await spotifyFetch(
					`/artists/${artistId}/top-tracks?market=US`
				);
				return z
					.object({
						tracks: SpotifyTrackSchema.array(),
					})
					.parse(data).tracks;
			}),
	}),
});
