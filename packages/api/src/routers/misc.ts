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
	// {
	// 	albumId: "476178105",
	// 	date: dayjs.tz("2024-09-04", "YYYY-MM-DD", "America/Toronto"),
	// },
	// {
	// 	albumId: "632126401",
	// 	date: dayjs.tz("2024-09-05", "YYYY-MM-DD", "America/Toronto"),
	// },
	// {
	// 	albumId: "383703577",
	// 	date: dayjs.tz("2024-09-06", "YYYY-MM-DD", "America/Toronto"),
	// },
	// {
	// 	albumId: "14880317",
	// 	date: dayjs.tz("2024-09-07", "YYYY-MM-DD", "America/Toronto"),
	// },
	// {
	// 	albumId: "939399",
	// 	date: dayjs.tz("2024-09-08", "YYYY-MM-DD", "America/Toronto"),
	// },
	// {
	// 	albumId: "12935874",
	// 	date: dayjs.tz("2024-09-09", "YYYY-MM-DD", "America/Toronto"),
	// },
	// {
	// 	albumId: "42886601",
	// 	date: dayjs.tz("2024-09-10", "YYYY-MM-DD", "America/Toronto"),
	// },
	// {
	// 	albumId: "1345642",
	// 	date: dayjs.tz("2024-09-11", "YYYY-MM-DD", "America/Toronto"),
	// },
	// {
	// 	albumId: "111543262",
	// 	date: dayjs.tz("2024-09-12", "YYYY-MM-DD", "America/Toronto"),
	// },
	// {
	// 	albumId: "42800161",
	// 	date: dayjs.tz("2024-09-13", "YYYY-MM-DD", "America/Toronto"),
	// },
	// {
	// 	albumId: "348380787",
	// 	date: dayjs.tz("2024-09-14", "YYYY-MM-DD", "America/Toronto"),
	// },
	// {
	// 	albumId: "124286",
	// 	date: dayjs.tz("2024-09-15", "YYYY-MM-DD", "America/Toronto"),
	// },
	// {
	// 	albumId: "425207127",
	// 	date: dayjs.tz("2024-09-16", "YYYY-MM-DD", "America/Toronto"),
	// },
	// {
	// 	albumId: "1346746",
	// 	date: dayjs.tz("2024-09-17", "YYYY-MM-DD", "America/Toronto"),
	// },
	// {
	// 	albumId: "91840",
	// 	date: dayjs.tz("2024-09-18", "YYYY-MM-DD", "America/Toronto"),
	// },
	// {
	// 	albumId: "399057",
	// 	date: dayjs.tz("2024-09-19", "YYYY-MM-DD", "America/Toronto"),
	// },
	// {
	// 	albumId: "8015538",
	// 	date: dayjs.tz("2024-09-20", "YYYY-MM-DD", "America/Toronto"),
	// },
	// {
	// 	albumId: "185280862",
	// 	date: dayjs.tz("2024-09-21", "YYYY-MM-DD", "America/Toronto"),
	// },
	// {
	// 	albumId: "1543242",
	// 	date: dayjs.tz("2024-09-22", "YYYY-MM-DD", "America/Toronto"),
	// },
	// {
	// 	albumId: "64371122",
	// 	date: dayjs.tz("2024-09-23", "YYYY-MM-DD", "America/Toronto"),
	// },
	// {
	// 	albumId: "586169192",
	// 	date: dayjs.tz("2024-09-24", "YYYY-MM-DD", "America/Toronto"),
	// },
	// {
	// 	albumId: "383055",
	// 	date: dayjs.tz("2024-09-25", "YYYY-MM-DD", "America/Toronto"),
	// },
	// {
	// 	albumId: "1435446",
	// 	date: dayjs.tz("2024-08-22", "YYYY-MM-DD", "America/Toronto"),
	// },

	{
		albumId: "476178105",
		date: dayjs.tz("2024-09-16", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "632126401",
		date: dayjs.tz("2024-09-17", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "383703577",
		date: dayjs.tz("2024-09-18", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "14880317",
		date: dayjs.tz("2024-09-19", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "939399",
		date: dayjs.tz("2024-09-20", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "12935874",
		date: dayjs.tz("2024-09-21", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "42886601",
		date: dayjs.tz("2024-09-22", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1345642",
		date: dayjs.tz("2024-09-23", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "111543262",
		date: dayjs.tz("2024-09-24", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "42800161",
		date: dayjs.tz("2024-09-25", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "348380787",
		date: dayjs.tz("2024-09-26", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "124286",
		date: dayjs.tz("2024-09-27", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "425207127",
		date: dayjs.tz("2024-09-28", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1346746",
		date: dayjs.tz("2024-09-29", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "91840",
		date: dayjs.tz("2024-09-30", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "399057",
		date: dayjs.tz("2024-10-01", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "8015538",
		date: dayjs.tz("2024-10-02", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "185280862",
		date: dayjs.tz("2024-10-03", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1543242",
		date: dayjs.tz("2024-10-04", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "64371122",
		date: dayjs.tz("2024-10-05", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "586169192",
		date: dayjs.tz("2024-10-06", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "383055",
		date: dayjs.tz("2024-10-07", "YYYY-MM-DD", "America/Toronto"),
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
