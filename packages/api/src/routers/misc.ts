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
	{
		albumId: "384314",
		date: dayjs.tz("2024-06-23", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "384314",
		date: dayjs.tz("2024-06-24", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "93038342",
		date: dayjs.tz("2024-06-25", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "170950362",
		date: dayjs.tz("2024-06-26", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "106054",
		date: dayjs.tz("2024-06-27", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "6941016",
		date: dayjs.tz("2024-06-28", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "326313137",
		date: dayjs.tz("2024-06-29", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "139890932",
		date: dayjs.tz("2024-06-30", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "550558532",
		date: dayjs.tz("2024-07-01", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "13257639",
		date: dayjs.tz("2024-07-02", "YYYY-MM-DD", "America/Toronto"),
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
