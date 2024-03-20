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
		albumId: "44730061",
		date: dayjs.tz("2024-02-23", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "542677642",
		date: dayjs.tz("2024-02-24", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "117320",
		date: dayjs.tz("2024-02-25", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "6982611",
		date: dayjs.tz("2024-02-26", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "423868847",
		date: dayjs.tz("2024-02-27", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "60322892",
		date: dayjs.tz("2024-02-28", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1440807",
		date: dayjs.tz("2024-02-29", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "93038342",
		date: dayjs.tz("2024-03-01", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "107638",
		date: dayjs.tz("2024-03-02", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "384314",
		date: dayjs.tz("2024-03-03", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "423868847",
		date: dayjs.tz("2024-03-04", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "549643892",
		date: dayjs.tz("2024-03-05", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "548477832",
		date: dayjs.tz("2024-03-06", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "405219857",
		date: dayjs.tz("2024-03-07", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "556294552",
		date: dayjs.tz("2024-03-08", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "451265235",
		date: dayjs.tz("2024-03-09", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "104660202",
		date: dayjs.tz("2024-03-10", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "257803",
		date: dayjs.tz("2024-03-11", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "44730061",
		date: dayjs.tz("2024-03-12", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "539734212",
		date: dayjs.tz("2024-03-13", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1440807",
		date: dayjs.tz("2024-03-14", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "65371772",
		date: dayjs.tz("2024-03-15", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "11205422",
		date: dayjs.tz("2024-03-16", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "6575789",
		date: dayjs.tz("2024-03-17", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "60322892",
		date: dayjs.tz("2024-03-18", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "14880659",
		date: dayjs.tz("2024-03-19", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "320928987",
		date: dayjs.tz("2024-03-20", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "504180521",
		date: dayjs.tz("2024-03-21", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "455130",
		date: dayjs.tz("2024-03-22", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "9236757",
		date: dayjs.tz("2024-03-23", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1452138",
		date: dayjs.tz("2024-03-24", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1233211",
		date: dayjs.tz("2024-03-25", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "413452427",
		date: dayjs.tz("2024-03-26", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "11591214",
		date: dayjs.tz("2024-03-27", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "249353",
		date: dayjs.tz("2024-03-28", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "7291105",
		date: dayjs.tz("2024-03-29", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "86994002",
		date: dayjs.tz("2024-03-30", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "43265861",
		date: dayjs.tz("2024-03-31", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "47131362",
		date: dayjs.tz("2024-04-01", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "10709540",
		date: dayjs.tz("2024-04-02", "YYYY-MM-DD", "America/Toronto"),
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
		return yesterdaysAlbum ? yesterdaysAlbum : albums[0];
	}),
});
