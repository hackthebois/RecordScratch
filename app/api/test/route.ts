import { NextResponse } from "next/server";

// Handles GET requests to /api
export async function GET() {
	return NextResponse.json({ msg: "" });
}
