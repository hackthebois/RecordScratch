import { SelectSongRating } from "@/drizzle/db/schema";
import { SongRatingAverages } from "@/drizzle/db/songFuncs";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

// Gets rating from song averages for a specified album
export const findSongAverage = (
	songRatings: SongRatingAverages,
	id: SelectSongRating["songId"]
) => {
	return songRatings?.find(({ songId }) => id === songId)?.ratingAverage;
};
