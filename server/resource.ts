import { ratings } from "@/server/db/schema";
import { ResourceSchema } from "@/types/rating";
import { and, avg, count, desc, eq, inArray, isNotNull } from "drizzle-orm";
import {
	SpotifyAlbum,
	SpotifyAlbumSchema,
	SpotifyArtistSchema,
	SpotifyTrackSchema,
} from "types/spotify";
import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { appendReviewResource, spotifyFetch } from "./utils";

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
		getListAverage: publicProcedure
			.input(ResourceSchema.array())
			.query(async ({ ctx: { db }, input: resources }) => {
				const rating = await db
					.select({
						average: avg(ratings.rating),
						total: count(ratings.rating),
					})
					.from(ratings)
					.where(
						and(
							inArray(
								ratings.resourceId,
								resources.map((a) => a.resourceId)
							)
						)
					);
				return rating.length ? { ...rating[0] } : null;
			}),
		community: publicProcedure
			.input(
				z.object({
					resource: ResourceSchema,
					page: z.number().optional(),
					limit: z.number().optional(),
				})
			)
			.query(
				async ({
					ctx: { db },
					input: {
						resource: { resourceId, category },
						page = 1,
						limit = 10,
					},
				}) => {
					const ratingList = await db.query.ratings.findMany({
						where: and(
							eq(ratings.resourceId, resourceId),
							eq(ratings.category, category),
							isNotNull(ratings.content)
						),
						limit,
						offset: (page - 1) * limit,
						orderBy: (ratings, { desc }) => [
							desc(ratings.createdAt),
						],
						with: {
							profile: true,
						},
					});
					return await appendReviewResource(ratingList);
				}
			),
		feed: publicProcedure
			.input(
				z.object({
					page: z.number().optional(),
					limit: z.number().optional(),
				})
			)
			.query(async ({ ctx: { db }, input: { page = 1, limit = 10 } }) => {
				const ratingList = await db.query.ratings.findMany({
					limit,
					offset: (page - 1) * limit,
					orderBy: (ratings, { desc }) => [desc(ratings.createdAt)],
					with: {
						profile: true,
					},
				});
				return await appendReviewResource(ratingList);
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
		getUniqueIds: publicProcedure.query(async ({ ctx: { db } }) => {
			const albums = await db
				.select({
					resourceId: ratings.resourceId,
				})
				.from(ratings)
				.where(eq(ratings.category, "ALBUM"))
				.groupBy(ratings.resourceId);
			return albums.map(({ resourceId }) => resourceId);
		}),
		newReleases: publicProcedure.query(async () => {
			const { data } = await spotifyFetch("/browse/new-releases");
			return z
				.object({
					albums: z.object({ items: SpotifyAlbumSchema.array() }),
				})
				.parse(data).albums.items;
		}),
		trending: publicProcedure.query(async ({ ctx: { db } }) => {
			const albums = await db
				.select({
					total: count(ratings.rating),
					resourceId: ratings.resourceId,
				})
				.from(ratings)
				.where(eq(ratings.category, "ALBUM"))
				.groupBy(ratings.resourceId)
				.orderBy(({ total }) => desc(total))
				.limit(20);
			if (albums.length === 0) return [];
			const { data } = await spotifyFetch(
				"/albums/?ids=" + albums.map((a) => a.resourceId).join(",")
			);
			return z
				.object({
					albums: SpotifyAlbumSchema.array(),
				})
				.parse(data).albums;
		}),
		top: publicProcedure.query(async ({ ctx: { db } }) => {
			const albums = await db
				.select({
					average: avg(ratings.rating),
					resourceId: ratings.resourceId,
				})
				.from(ratings)
				.where(eq(ratings.category, "ALBUM"))
				.groupBy(ratings.resourceId)
				.orderBy(({ average }) => desc(average))
				.limit(20);
			if (albums.length === 0) return [];
			const { data } = await spotifyFetch(
				"/albums/?ids=" + albums.map((a) => a.resourceId).join(",")
			);
			return z
				.object({
					albums: SpotifyAlbumSchema.array(),
				})
				.parse(data).albums;
		}),
	}),
	song: router({
		get: publicProcedure
			.input(z.string())
			.query(async ({ input: songId }) => {
				const { data } = await spotifyFetch(`/tracks/${songId}`);
				return SpotifyTrackSchema.extend({
					album: SpotifyAlbumSchema,
				}).parse(data);
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
				const albums: SpotifyAlbum[] = [];
				const getAllAlbums = async (offset = 0) => {
					const { data } = await spotifyFetch(
						`/artists/${artistId}/albums?include_groups=album,single&offset=${offset}&limit=50`
					);
					const { items } = z
						.object({
							items: SpotifyAlbumSchema.array(),
						})
						.parse(data);
					albums.push(...items);
					if (items.length !== 0) {
						await getAllAlbums(offset + 50);
					}
				};
				await getAllAlbums();
				return albums;
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
