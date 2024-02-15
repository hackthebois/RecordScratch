import { getFollowCount, getFollowProfiles } from "@/recordscratch/app/_api";
import { NextResponse } from "next/server";

// Handles GET requests to /api
export async function GET() {
	// const res = await getFollowProfiles(
	// 	"user_2WiWGGohaQHfTZ2GAhIknP2evxi",
	// 	false
	// );
	let res = await getFollowProfiles(
		"user_2TMF8gtp24d2Jgn4ua9ETLF0u65",
		"user_2bNUIPbA2QnC7Ose7a6Pp5SivDt",
		"following"
	);

	let res2 = await getFollowCount(
		"user_2TMF8gtp24d2Jgn4ua9ETLF0u65",
		"following"
	);

	return NextResponse.json({ res2 });
}
