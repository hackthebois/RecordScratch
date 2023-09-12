import { spotifySearch } from "@/lib/spotify";

export const GET = async (req: Request) => {
	const { searchParams } = new URL(req.url);
	return await spotifySearch(searchParams.get("q") ?? "");
};
