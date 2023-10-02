import { getRatingAverage } from "@/drizzle/db/albumFuncs";
import { getAllSongAverages } from "@/drizzle/db/songFuncs";

export type AlbumRatingAverage = Awaited<ReturnType<typeof getRatingAverage>>;
export type SongRatingAverages = Awaited<ReturnType<typeof getAllSongAverages>>;
