import { NextResponse } from "next/server";
import { z } from "zod";

// Define the shape of the data using Zod
const ArtistSchema = z.object({
	name: z.string().min(2).max(50),
});
// You can infer ther type from the schema if needed
type Artist = z.infer<typeof ArtistSchema>;

// Export the HTTP methods

export const GET = async () => {
	// Get data from a database or API
	const data = [{ name: "Billy" }, { name: "Bob" }];

	return NextResponse.json(data);
};

export const POST = async (req: Request) => {
	// Get the body of the request from the request object
	const body = await req.json();

	// Validate the body
	const artist = ArtistSchema.safeParse(body);

	if (!artist.success) {
		return NextResponse.json("Bad input", { status: 400 });
	}

	console.log(artist.data);

	// Save the data to a database or API

	return NextResponse.json(artist.data);
};
