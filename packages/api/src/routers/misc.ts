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
		albumId: "1437015",
		date: dayjs.tz("2024-11-21", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "340880",
		date: dayjs.tz("2024-11-22", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "10945496",
		date: dayjs.tz("2024-11-23", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "175927162",
		date: dayjs.tz("2024-11-24", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "12047938",
		date: dayjs.tz("2024-11-25", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1206405",
		date: dayjs.tz("2024-11-26", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "662648981",
		date: dayjs.tz("2024-11-27", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "11918418",
		date: dayjs.tz("2024-11-28", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "369496",
		date: dayjs.tz("2024-11-29", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "103257",
		date: dayjs.tz("2024-11-30", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "217750",
		date: dayjs.tz("2024-12-01", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "613136",
		date: dayjs.tz("2024-12-02", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "86507",
		date: dayjs.tz("2024-12-03", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "321160767",
		date: dayjs.tz("2024-12-04", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "106912502",
		date: dayjs.tz("2024-12-05", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "301631",
		date: dayjs.tz("2024-12-06", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "111628",
		date: dayjs.tz("2024-12-07", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "107031",
		date: dayjs.tz("2024-12-08", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "302210",
		date: dayjs.tz("2024-12-09", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "320863097",
		date: dayjs.tz("2024-12-10", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "9859372",
		date: dayjs.tz("2024-12-11", "YYYY-MM-DD", "America/Toronto"),
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
