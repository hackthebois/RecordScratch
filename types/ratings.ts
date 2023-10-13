import { getRatingAverage } from "@/drizzle/db/ratingsUtils";
import { Rating, RatingCategory, UserRating } from "@/drizzle/db/schema";
import { getAllSongAverages } from "@/drizzle/db/songUtils";

export type AlbumRatingAverage = Awaited<ReturnType<typeof getRatingAverage>>;
export type SongRatingAverages = Awaited<ReturnType<typeof getAllSongAverages>>;

export type Resource = {
	resourceId: string;
	category: RatingCategory;
};

export type Ratings = {
	rating?: Rating | null;
	userRating?: UserRating | null;
};
