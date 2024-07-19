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
		albumId: "149142962",
		date: dayjs.tz("2024-07-15", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "13868756",
		date: dayjs.tz("2024-07-18", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "14879739",
		date: dayjs.tz("2024-07-19", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "616399991",
		date: dayjs.tz("2024-07-20", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1299957",
		date: dayjs.tz("2024-07-21", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "271542",
		date: dayjs.tz("2024-07-22", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "301773",
		date: dayjs.tz("2024-07-23", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "121439",
		date: dayjs.tz("2024-07-24", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "660856",
		date: dayjs.tz("2024-07-25", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "39949511",
		date: dayjs.tz("2024-07-26", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "301752",
		date: dayjs.tz("2024-07-27", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "272206452",
		date: dayjs.tz("2024-07-28", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "11443410",
		date: dayjs.tz("2024-07-29", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "4351521",
		date: dayjs.tz("2024-07-30", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "77941202",
		date: dayjs.tz("2024-07-31", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "299584",
		date: dayjs.tz("2024-08-01", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "224907",
		date: dayjs.tz("2024-08-02", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "8623962",
		date: dayjs.tz("2024-08-03", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "57101162",
		date: dayjs.tz("2024-08-04", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "153450592",
		date: dayjs.tz("2024-08-05", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "302127",
		date: dayjs.tz("2024-08-06", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "231352",
		date: dayjs.tz("2024-08-07", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "320456997",
		date: dayjs.tz("2024-08-08", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "6508872",
		date: dayjs.tz("2024-08-09", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "9908666",
		date: dayjs.tz("2024-08-10", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1347692",
		date: dayjs.tz("2024-08-11", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "382919757",
		date: dayjs.tz("2024-08-12", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "70982",
		date: dayjs.tz("2024-08-13", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "122163072",
		date: dayjs.tz("2024-08-14", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "402935287",
		date: dayjs.tz("2024-08-15", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "6893935",
		date: dayjs.tz("2024-08-16", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "71318",
		date: dayjs.tz("2024-08-17", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "2908271",
		date: dayjs.tz("2024-08-18", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "5946143",
		date: dayjs.tz("2024-08-19", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "708674",
		date: dayjs.tz("2024-08-20", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1435446",
		date: dayjs.tz("2024-08-21", "YYYY-MM-DD", "America/Toronto"),
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
