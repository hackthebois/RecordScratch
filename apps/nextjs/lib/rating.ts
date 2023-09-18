"use server";
import { Rating, insertUser } from "@/drizzle/db/functions";
import { auth } from "@clerk/nextjs";

export type RateAlbum = {
	rating: Rating["rating"];
	albumId: Rating["albumId"];
};

export const rateAlbum = async (rating: RateAlbum) => {
	const { userId } = auth();

	if (!userId) {
		throw new Error("You must be logged in to rate albums.");
	}

	await insertUser({ ...rating, userId });
};
