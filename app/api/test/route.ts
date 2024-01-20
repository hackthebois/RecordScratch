import { NextResponse } from "next/server";

// Handles GET requests to /api
export async function GET() {
	console.log("hello world");
	return NextResponse.json({ msg: "" });
}
