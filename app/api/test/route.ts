import { logServerEvent } from "@/server/posthog";
import { NextResponse } from "next/server";

// Handles GET requests to /api
export async function GET() {
	console.log("hello world");
	// const userRatings = await serverTrpc.user.profile.distribution);
	await logServerEvent("spotify request", {
		properties: {
			url: "/1",
		},
		distinctId: "test",
	});
	return NextResponse.json({ msg: "Hello world" });
}
