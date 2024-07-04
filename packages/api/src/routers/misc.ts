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
		albumId: "550558532",
		date: dayjs.tz("2024-07-01", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "13257639",
		date: dayjs.tz("2024-07-02", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "43265861",
		date: dayjs.tz("2024-07-03", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "7485484",
		date: dayjs.tz("2024-07-04", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "100905552",
		date: dayjs.tz("2024-07-05", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "367622287",
		date: dayjs.tz("2024-07-06", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "597350882",
		date: dayjs.tz("2024-07-07", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "12330310",
		date: dayjs.tz("2024-07-08", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "54307722",
		date: dayjs.tz("2024-07-09", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "319814",
		date: dayjs.tz("2024-07-10", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "489849155",
		date: dayjs.tz("2024-07-11", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "941125",
		date: dayjs.tz("2024-07-12", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "12215006",
		date: dayjs.tz("2024-07-13", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "273467",
		date: dayjs.tz("2024-07-14", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "149142962",
		date: dayjs.tz("2024-07-15", "YYYY-MM-DD", "America/Toronto"),
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
