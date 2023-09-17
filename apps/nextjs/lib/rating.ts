"use server";
import { NewRating, insertUser } from "@/drizzle/db/functions";

export const rateAlbum = async (userId: string, albumId: string, rating: number) => {
	const newRating: NewRating = { userId: userId, albumId: albumId, rating: rating };
	await insertUser(newRating)
  };
  