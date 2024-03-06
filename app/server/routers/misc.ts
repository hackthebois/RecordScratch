import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import { publicProcedure, router } from "../trpc";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

const albums = [
	{
		albumId: "44730061",
		date: new Date(2024, 1, 23),
	},
	{
		albumId: "542677642",
		date: new Date(2024, 1, 24),
	},
	{
		albumId: "117320",
		date: new Date(2024, 1, 25),
	},
	{
		albumId: "6982611",
		date: new Date(2024, 1, 26),
	},
	{
		albumId: "423868847",
		date: new Date(2024, 1, 27),
	},
	{
		albumId: "60322892",
		date: new Date(2024, 1, 28),
	},
	{
		albumId: "1440807",
		date: new Date(2024, 1, 29),
	},
	{
		albumId: "93038342",
		date: new Date(2024, 2, 1),
	},
	{
		albumId: "107638",
		date: new Date(2024, 2, 2),
	},
	{
		albumId: "384314",
		date: new Date(2024, 2, 3),
	},
	{
		albumId: "423868847",
		date: new Date(2024, 2, 4),
	},
	{
		albumId: "549643892",
		date: new Date(2024, 2, 5),
	},
	{
		albumId: "548477832",
		date: new Date(2024, 2, 6),
	},
	{
		albumId: "405219857",
		date: new Date(2024, 2, 7),
	},
	{
		albumId: "",
		date: new Date(2024, 2, 8),
	},
	{
		albumId: "451265235",
		date: new Date(2024, 2, 9),
	},
	{
		albumId: "104660202",
		date: new Date(2024, 2, 10),
	},
	{
		albumId: "257803",
		date: new Date(2024, 2, 11),
	},
	{
		albumId: "44730061",
		date: new Date(2024, 2, 12),
	},
	{
		albumId: "539734212",
		date: new Date(2024, 2, 13),
	},
	{
		albumId: "1440807",
		date: new Date(2024, 2, 14),
	},
	{
		albumId: "65371772",
		date: new Date(2024, 2, 15),
	},
	{
		albumId: "11205422",
		date: new Date(2024, 2, 16),
	},
	{
		albumId: "6575789",
		date: new Date(2024, 2, 17),
	},
	{
		albumId: "60322892",
		date: new Date(2024, 2, 18),
	},
	{
		albumId: "14880659",
		date: new Date(2024, 2, 19),
	},
	{
		albumId: "504180521",
		date: new Date(2024, 2, 20),
	},
	{
		albumId: "455130",
		date: new Date(2024, 2, 21),
	},
	{
		albumId: "9236757",
		date: new Date(2024, 2, 22),
	},
	{
		albumId: "1452138",
		date: new Date(2024, 2, 23),
	},
	{
		albumId: "1233211",
		date: new Date(2024, 2, 24),
	},
	{
		albumId: "413452427",
		date: new Date(2024, 2, 25),
	},
	{
		albumId: "11591214",
		date: new Date(2024, 2, 26),
	},
	{
		albumId: "249353",
		date: new Date(2024, 2, 27),
	},
	{
		albumId: "7291105",
		date: new Date(2024, 2, 28),
	},
	{
		albumId: "86994002",
		date: new Date(2024, 2, 29),
	},
	{
		albumId: "43265861",
		date: new Date(2024, 2, 30),
	},
	{
		albumId: "47131362",
		date: new Date(2024, 2, 31),
	},
	{
		albumId: "10709540",
		date: new Date(2024, 3, 1),
	},
];

export const miscRouter = router({
	albumOfTheDay: publicProcedure.query(() => {
		const albumOfTheDay = albums.find((album) => {
			if (dayjs(album.date).isToday() && album.albumId !== "") {
				return true;
			}
		});
		if (albumOfTheDay) return albumOfTheDay;

		// If there is no album of the day, return yesterday's album
		const yesterdaysAlbum = albums.find((album) => {
			if (dayjs(album.date).isYesterday() && album.albumId !== "") {
				return true;
			}
		});
		return yesterdaysAlbum ? yesterdaysAlbum : albums[0];
	}),
});
