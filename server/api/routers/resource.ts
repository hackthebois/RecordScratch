import { ratings } from "@/server/db/schema";
import { ResourceSchema } from "@/types/rating";
import { SimplifiedAlbum } from "@spotify/web-api-ts-sdk";
import { and, avg, count, desc, eq, inArray, isNotNull } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { appendReviewResource } from "../utils";

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
					ctx: { db, spotify },
					input: {
						resource: { resourceId, category },
						page = 1,
						limit = 25,
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
					return await appendReviewResource(ratingList, spotify);
				}
			),
		feed: publicProcedure
			.input(
				z.object({
					page: z.number().optional(),
					limit: z.number().optional(),
				})
			)
			.query(
				async ({
					ctx: { db, spotify },
					input: { page = 1, limit = 25 },
				}) => {
					const ratingList = await db.query.ratings.findMany({
						limit,
						offset: (page - 1) * limit,
						orderBy: (ratings, { desc }) => [
							desc(ratings.createdAt),
						],
						with: {
							profile: true,
						},
					});
					return await appendReviewResource(ratingList, spotify);
				}
			),
	}),
	search: publicProcedure
		.input(z.string().min(1))
		.query(async ({ input: q, ctx: { spotify } }) => {
			return await spotify.search(q, ["album", "artist"], undefined, 4);
		}),
	album: router({
		get: publicProcedure
			.input(z.string())
			.query(async ({ input: albumId, ctx: { spotify } }) => {
				return await spotify.albums.get(albumId);
			}),
		newReleases: publicProcedure.query(async ({ ctx: { spotify } }) => {
			return await spotify.browse.getNewReleases();
		}),
		trending: publicProcedure.query(async ({ ctx: { db, spotify } }) => {
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
			return await spotify.albums.get(albums.map((a) => a.resourceId));
		}),
		top: publicProcedure.query(async ({ ctx: { db, spotify } }) => {
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
			return await spotify.albums.get(albums.map((a) => a.resourceId));
		}),
	}),
	song: router({
		get: publicProcedure
			.input(z.string())
			.query(async ({ input: songId, ctx: { spotify } }) => {
				return await spotify.tracks.get(songId);
			}),
	}),
	artist: router({
		get: publicProcedure
			.input(z.string())
			.query(async ({ input: artistId, ctx: { spotify } }) => {
				return await spotify.artists.get(artistId);
			}),
		albums: publicProcedure
			.input(z.string())
			.query(async ({ input: artistId, ctx: { userId, spotify } }) => {
				const albums: SimplifiedAlbum[] = [];
				const getAllAlbums = async (offset = 0) => {
					const newAlbums = await spotify.artists.albums(
						artistId,
						"album,single",
						undefined,
						50,
						offset
					);
					albums.push(...newAlbums.items);
					// TODO: handle this without the extra request for 0 (check next)
					console.log(newAlbums.next);
					if (newAlbums.items.length !== 0) {
						await getAllAlbums(offset + 50);
					}
				};
				await getAllAlbums();
				return albums;
			}),
		topTracks: publicProcedure
			.input(z.string())
			.query(async ({ input: artistId, ctx: { spotify } }) => {
				return await spotify.artists.topTracks(artistId, "US");
			}),
	}),
});
