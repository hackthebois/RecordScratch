import { getFollowCount, getFollowProfiles, isUserFollowing } from "@/app/_api";
import { unFollowUser } from "@/app/_api/actions";
import { NextResponse } from "next/server";

// Handles GET requests to /api
export async function GET() {
	// const res = await getFollowProfiles(
	// 	"user_2WiWGGohaQHfTZ2GAhIknP2evxi",
	// 	false
	// );
	const res = await getFollowCount("user_2VXWWlwa2rF83rzKD8rnmoYmDac");

	return NextResponse.json({ res });
}
