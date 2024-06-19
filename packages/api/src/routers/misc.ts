import dayjs from "dayjs";
import TimezonePlugin from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { publicProcedure, router } from "../trpc";

dayjs.extend(TimezonePlugin);
dayjs.extend(utc);

const albums: {
	albumId: string;
	date: dayjs.Dayjs;
}[] = [
	{
		albumId: "303072",
		date: dayjs.tz("2024-06-17", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1345663",
		date: dayjs.tz("2024-06-18", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "108706862",
		date: dayjs.tz("2024-06-19", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "162134",
		date: dayjs.tz("2024-06-20", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1435446",
		date: dayjs.tz("2024-06-21", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "12965126",
		date: dayjs.tz("2024-06-22", "YYYY-MM-DD", "America/Toronto"),
	},
];

export const miscRouter = router({
	albumOfTheDay: publicProcedure.query(() => {
		const timezone = "America/Toronto";
		const now = dayjs().tz(timezone);
		const albumOfTheDay = albums.find((album) => {
			if (now.isSame(album.date, "day") && album.albumId !== "") {
				return true;
			}
		});
		if (albumOfTheDay) return albumOfTheDay;

		// If there is no album of the day, return yesterday's album
		const yesterday = now.subtract(1, "day");
		const yesterdaysAlbum = albums.find((album) => {
			if (yesterday.isSame(album.date, "day") && album.albumId !== "") {
				return true;
			}
		});

		const fallbackAlbum = {
			albumId: "44730061",
			date: dayjs.tz("2024-02-23", "YYYY-MM-DD", "America/Toronto"),
		};

		return yesterdaysAlbum ? yesterdaysAlbum : fallbackAlbum;
	}),
});
