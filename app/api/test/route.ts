import { getServerAuth } from "@/server/api/utils";
import { NextResponse } from "next/server";

// Handles GET requests to /api
export async function GET() {
	console.log("hello world");
	const userId = await getServerAuth();
	return NextResponse.json({ msg: userId });
}
