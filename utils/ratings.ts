import { serverTrpc } from "@/app/_trpc/server";
import { UserRating } from "@/drizzle/db/schema";
import { Resource } from "@/types/ratings";
import { auth } from "@clerk/nextjs";

export const getRatings = async (resource: Resource) => {
	const { userId } = auth();

	let userRating: UserRating | null = null;
	if (userId) {
		userRating = await serverTrpc.rating.getUserRating(resource);
	}

	const rating = await serverTrpc.rating.getAverage(resource);

	return { rating, userRating };
};
