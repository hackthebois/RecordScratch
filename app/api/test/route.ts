import { isUserFollowing } from "@/app/_api";
import { unFollowUser } from "@/app/_api/actions";
import { NextResponse } from "next/server";

// Handles GET requests to /api
export async function GET() {
	const res = await isUserFollowing("user_2TMF8gtp24d2Jgn4ua9ETLF0u65");

	return NextResponse.json({ res });
}
