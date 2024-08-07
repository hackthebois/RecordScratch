import { Deezer, deezer as d, getQueryOptions as gqo } from "@recordscratch/lib";

export const deezer = <TRoute extends keyof Deezer>(input: {
	route: TRoute;
	input: Deezer[TRoute]["input"];
}): Promise<Deezer[TRoute]["output"]> => {
	return d({
		...input,
		baseUrl: process.env.EXPO_PUBLIC_CF_PAGES_URL!,
	});
};

export const getQueryOptions = <TRoute extends keyof Deezer>(input: {
	route: TRoute;
	input: Deezer[TRoute]["input"];
}) => {
	return gqo({
		...input,
		baseUrl: process.env.EXPO_PUBLIC_CF_PAGES_URL!,
	});
};
