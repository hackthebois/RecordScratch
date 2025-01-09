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
		albumId: "596750192",
		date: dayjs.tz("2025-01-08", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "623320871",
		date: dayjs.tz("2025-01-09", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "231621",
		date: dayjs.tz("2025-01-10", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "113509",
		date: dayjs.tz("2025-01-11", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "12487266",
		date: dayjs.tz("2025-01-12", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "667542691",
		date: dayjs.tz("2025-01-13", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1372014",
		date: dayjs.tz("2025-01-14", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "91347",
		date: dayjs.tz("2025-01-15", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "6846414",
		date: dayjs.tz("2025-01-16", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "664110261",
		date: dayjs.tz("2025-01-17", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "482869875",
		date: dayjs.tz("2025-01-18", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1345239",
		date: dayjs.tz("2025-01-19", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "575769721",
		date: dayjs.tz("2025-01-20", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "77496",
		date: dayjs.tz("2025-01-21", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "9479122",
		date: dayjs.tz("2025-01-22", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "164869492",
		date: dayjs.tz("2025-01-23", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "80558",
		date: dayjs.tz("2025-01-24", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "569381241",
		date: dayjs.tz("2025-01-25", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "603616662",
		date: dayjs.tz("2025-01-26", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "436157",
		date: dayjs.tz("2025-01-27", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "325753737",
		date: dayjs.tz("2025-01-28", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "8623962",
		date: dayjs.tz("2025-01-29", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1346721",
		date: dayjs.tz("2025-01-30", "YYYY-MM-DD", "America/Toronto"),
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
