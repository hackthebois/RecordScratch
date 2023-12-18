import { NextResponse } from "next/server";
import { serverTrpc } from "@/app/_trpc/server";

// Handles GET requests to /api
export async function GET() {
	const userRatings = await serverTrpc.user.profile.userDistribution({
		category: "ALBUM",
	});
	return NextResponse.json({ userRatings });
}
