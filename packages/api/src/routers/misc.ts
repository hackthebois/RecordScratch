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
		albumId: "1344846",
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
		albumId: "11591214",
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
	{
		albumId: "908516",
		date: dayjs.tz("2024-04-03", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "384180",
		date: dayjs.tz("2024-04-04", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "301504767",
		date: dayjs.tz("2024-04-05", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1442557",
		date: dayjs.tz("2024-04-06", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "6237061",
		date: dayjs.tz("2024-04-07", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "12047960",
		date: dayjs.tz("2024-04-08", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "12114240",
		date: dayjs.tz("2024-04-09", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "108358",
		date: dayjs.tz("2024-04-10", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "9416314",
		date: dayjs.tz("2024-04-11", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1252978",
		date: dayjs.tz("2024-04-12", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "484372295",
		date: dayjs.tz("2024-04-13", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "271562",
		date: dayjs.tz("2024-04-14", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "217795",
		date: dayjs.tz("2024-04-15", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "13995252",
		date: dayjs.tz("2024-04-16", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "8910319",
		date: dayjs.tz("2024-04-17", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "96126",
		date: dayjs.tz("2024-04-18", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "175927142",
		date: dayjs.tz("2024-04-19", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "249141",
		date: dayjs.tz("2024-04-20", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "3095481",
		date: dayjs.tz("2024-04-21", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "707965",
		date: dayjs.tz("2024-04-22", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "12047948",
		date: dayjs.tz("2024-04-23", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "94528282",
		date: dayjs.tz("2024-04-24", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1347738",
		date: dayjs.tz("2024-04-25", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "356690",
		date: dayjs.tz("2024-04-26", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "70821132",
		date: dayjs.tz("2024-04-27", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "6768976",
		date: dayjs.tz("2024-04-28", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "485379895",
		date: dayjs.tz("2024-04-29", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "13082992",
		date: dayjs.tz("2024-04-30", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "6856704",
		date: dayjs.tz("2024-05-01", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1421957",
		date: dayjs.tz("2024-05-02", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "66644212",
		date: dayjs.tz("2024-05-03", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "736492",
		date: dayjs.tz("2024-05-04", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "107858",
		date: dayjs.tz("2024-05-05", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "7517452",
		date: dayjs.tz("2024-05-06", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "153406392",
		date: dayjs.tz("2024-05-07", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "11336428",
		date: dayjs.tz("2024-05-08", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "97140952",
		date: dayjs.tz("2024-05-09", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "139385112",
		date: dayjs.tz("2024-05-10", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "301663",
		date: dayjs.tz("2024-05-11", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "653084",
		date: dayjs.tz("2024-05-12", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "7654077",
		date: dayjs.tz("2024-05-13", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "162683632",
		date: dayjs.tz("2024-05-14", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "488053955",
		date: dayjs.tz("2024-05-15", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "14880741",
		date: dayjs.tz("2024-05-16", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "6899610",
		date: dayjs.tz("2024-05-17", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "12114242",
		date: dayjs.tz("2024-05-18", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "9896728",
		date: dayjs.tz("2024-05-19", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "8497029",
		date: dayjs.tz("2024-05-20", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1440805",
		date: dayjs.tz("2024-05-21", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "302002",
		date: dayjs.tz("2024-05-22", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "11126554",
		date: dayjs.tz("2024-05-23", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "76056042",
		date: dayjs.tz("2024-05-24", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "90875",
		date: dayjs.tz("2024-05-25", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "436186197",
		date: dayjs.tz("2024-05-26", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "184480112",
		date: dayjs.tz("2024-05-27", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "184480112",
		date: dayjs.tz("2024-05-27", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "693773",
		date: dayjs.tz("2024-05-28", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "2380331",
		date: dayjs.tz("2024-05-29", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "11205658",
		date: dayjs.tz("2024-05-30", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "298400782",
		date: dayjs.tz("2024-05-31", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "106387",
		date: dayjs.tz("2024-06-01", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "14879699",
		date: dayjs.tz("2024-06-02", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "75621072",
		date: dayjs.tz("2024-06-03", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "227585",
		date: dayjs.tz("2024-06-04", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1602407",
		date: dayjs.tz("2024-06-05", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "125584",
		date: dayjs.tz("2024-06-06", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "11674696",
		date: dayjs.tz("2024-06-07", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "74906",
		date: dayjs.tz("2024-06-08", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "192713382",
		date: dayjs.tz("2024-06-09", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "9698192",
		date: dayjs.tz("2024-06-10", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "12047952",
		date: dayjs.tz("2024-06-11", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "343894437",
		date: dayjs.tz("2024-06-12", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "254297",
		date: dayjs.tz("2024-06-13", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "9410100",
		date: dayjs.tz("2024-06-14", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "10463910",
		date: dayjs.tz("2024-06-15", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1345731",
		date: dayjs.tz("2024-06-16", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "303072",
		date: dayjs.tz("2024-06-17", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1345663",
		date: dayjs.tz("2024-06-18", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1345662",
		date: dayjs.tz("2024-06-19", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "108706862",
		date: dayjs.tz("2024-06-20", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "162134",
		date: dayjs.tz("2024-06-21", "YYYY-MM-DD", "America/Toronto"),
	},
	{
		albumId: "1435446",
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
