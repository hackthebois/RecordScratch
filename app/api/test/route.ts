import { NextResponse } from "next/server";

// Handles GET requests to /api
export async function GET() {
	console.log("hello world");
	// const userRatings = await serverTrpc.user.profile.distribution);
	return NextResponse.json({ msg: "Hello world" });
}
