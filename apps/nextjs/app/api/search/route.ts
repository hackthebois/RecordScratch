import { spotifySearch } from "@/server/spotify";

export const GET = async (req: Request) => {
	const { searchParams } = new URL(req.url);
	return await spotifySearch(searchParams.get("q") ?? "");
};
