import { Google } from "arctic";
import { getQuery, H3Event } from "vinxi/http";

export const getGoogle = (event: H3Event) => {
	const expoAddress = getQuery(event).expoAddress as string;
	return new Google(
		process.env.GOOGLE_CLIENT_ID!,
		process.env.GOOGLE_CLIENT_SECRET!,
		`${process.env.CF_PAGES_URL}/api/auth/google/callback${expoAddress ? `?expoAddress=${expoAddress}` : ""}`
	);
};
