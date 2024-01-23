import { followingCount } from "@/app/_api/actions";
import { NextResponse } from "next/server";

// Handles GET requests to /api
export async function GET() {
	const res = await followingCount("1");

	return NextResponse.json({ res });
}
