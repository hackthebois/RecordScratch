import { getRatingAverage } from "@/drizzle/db/albumFuncs";
import { Rating, RatingCategory, UserRating } from "@/drizzle/db/schema";
import { getAllSongAverages } from "@/drizzle/db/songFuncs";

export type AlbumRatingAverage = Awaited<ReturnType<typeof getRatingAverage>>;
export type SongRatingAverages = Awaited<ReturnType<typeof getAllSongAverages>>;

export type Resource = {
	resourceId: string;
	type: RatingCategory;
};

export type Ratings = {
	rating: Rating | null;
	userRating: UserRating | null;
};
