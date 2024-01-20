import { env } from "@/env.mjs";
import { Profile } from "@/types/profile";
import { Rating, Resource, Review } from "@/types/rating";
import { TRPCError } from "@trpc/server";
import * as jose from "jose";
import { cookies } from "next/headers";
import {
	SpotifyAlbum,
	SpotifyAlbumSchema,
	SpotifyTrackSchema,
} from "types/spotify";
import { z } from "zod";
import { logServerEvent } from "../posthog";

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
		next: {
			revalidate: 60 * 59,
		},
		body: "grant_type=client_credentials",
		method: "POST",
	});
	const data = await res.json();
	return z.object({ access_token: z.string() }).parse(data).access_token;
};

export const appendReviewResource = async (
	ratingList: (Rating & { profile: Profile })[],
	userId: string | null
): Promise<Review[]> => {
	if (ratingList.length === 0) return [];

	let resourceExtras: (Resource & {
		album: SpotifyAlbum;
		name: string;
	})[] = [];

	const albums = ratingList.filter((r) => r.category === "ALBUM");
	const songs = ratingList.filter((r) => r.category === "SONG");

	if (albums.length !== 0) {
		const { data: albumData } = await spotifyFetch({
			url: "/albums/?ids=" + albums.map((a) => a.resourceId).join(","),
			userId,
		});
		const parsedAlbums = z
			.object({
				albums: SpotifyAlbumSchema.array(),
			})
			.parse(albumData).albums;
		resourceExtras.push(
			...parsedAlbums.map((album) => ({
				resourceId: album.id,
				category: "ALBUM" as Resource["category"],
				album,
				name: album.name,
			}))
		);
	}
	if (songs.length !== 0) {
		const { data: songData } = await spotifyFetch({
			url: "/tracks/?ids=" + songs.map((a) => a.resourceId).join(","),
			userId,
		});
		const parsedSongs = z
			.object({
				tracks: SpotifyTrackSchema.extend({
					album: SpotifyAlbumSchema,
				}).array(),
			})
			.parse(songData).tracks;
		resourceExtras.push(
			...parsedSongs.map((a) => ({
				resourceId: a.id,
				category: "SONG" as Resource["category"],
				album: a.album,
				name: a.name,
			}))
		);
	}

	return ratingList
		.filter(({ profile }) => profile !== null)
		.map(({ profile, ...rating }) => {
			const resource = resourceExtras.find(
				(r) =>
					r.resourceId === rating.resourceId &&
					r.category === rating.category
			);
			return {
				rating,
				profile,
				album: resource!.album,
				name: resource!.name,
			};
		});
};

export const spotifyFetch = async ({
	url,
	userId,
}: {
	url: string;
	userId: string | null;
}) => {
	const spotifyToken = await getSpotifyToken();

	const res = await fetch(`https://api.spotify.com/v1${url}`, {
		headers: {
			Authorization: `Bearer ${spotifyToken}`,
		},
	});

	await logServerEvent("spotify request", {
		distinctId: userId ?? "public",
		properties: {
			endpoint: url,
		},
	});

	if (!res.ok) {
		console.error(await res.text());
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message:
				"Spotify API error: " +
				res.statusText +
				" (" +
				res.status +
				")",
		});
	}

	const data: unknown = await res.json();
	return { data, res };
};

const JWKS = jose.createLocalJWKSet({
	keys: [
		{
			use: "sig",
			kty: "RSA",
			kid: "ins_2ZugwMdtbgoiwurhxIh6TF0oAWZ",
			alg: "RS256",
			n: "6P1Nh6C8_51Bvpyomq6i8tQvfp1uk8WzKhyFOFU0ffDpXzzNE5pnkyTPjtw5f5I1b1c8X-DYAmVhdWdYja1E_tlm_jbEGUGm4_u3htZgwqFTskR4CRCCa12p4o8QR40bhRawtoNW392rU1E9rKYkSzHG3el9sLKTJcKmgQ6xC9IPMz9-DkblgIDrJ0hYo_2uqyGgfKCKq0pAih6Oka4Ap9CiIVZJve4VKRaRHDqVLVOSmjn3g8D3EfGlT_EWtRvWIOyElX3hLfSb3l9TPg-fcfD77klk6lNyDhYu3LB-aX5FYo-VbuHWbNV13NiPU6tBhMGo5lIvadFxlaqeYlPMDw",
			e: "AQAB",
		},
	],
});

export const getServerAuth = async () => {
	const session = cookies().get("__session")?.value;

	if (!session) return null;

	try {
		const { payload } = await jose.jwtVerify(session, JWKS);
		return payload.sub ?? null;
	} catch (e) {
		if (e instanceof jose.errors.JWKSNoMatchingKey) {
			console.error("ERROR:", e.code);
		}
		return null;
	}
};
