import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "./config";
import { ratings } from "./schema";

/**********************************
	Song  Rating Database Functions
***********************************/

// Get the Album mean average for each album provided
export const getAllAlbumAverages = async (albums: string[]) => {
	const average = await db
		.select({
			ratingAverage: sql<number>`ROUND(AVG(rating), 1)`,
			totalRatings: sql<number>`COUNT(*)`,
		})
		.from(ratings)
		.where(
			and(
				inArray(ratings.resourceId, albums),
				eq(ratings.category, "ALBUM")
			)
		);

	if (!average.length) return null;
	else return average[0];
};
export type GetAllAlbumAverages = Awaited<
	ReturnType<typeof getAllAlbumAverages>
>;
