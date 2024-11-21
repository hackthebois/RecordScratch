import {
	Deezer,
	deezer as d,
	deezerHelpers as dh,
	getQueryOptions as gqo,
} from "@recordscratch/lib";
import env from "~/env";

export const deezer = <TRoute extends keyof Deezer>(input: {
	route: TRoute;
	input: Deezer[TRoute]["input"];
}): Promise<Deezer[TRoute]["output"]> => {
	return d({
		...input,
		baseUrl: env.SITE_URL,
	});
};

export const getQueryOptions = <TRoute extends keyof Deezer>(input: {
	route: TRoute;
	input: Deezer[TRoute]["input"];
}) => {
	return gqo({
		...input,
		baseUrl: env.SITE_URL,
	});
};

export const deezerHelpers = dh(env.SITE_URL);
