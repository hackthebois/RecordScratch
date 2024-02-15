"use client"; // Error components must be Client Components

import { Button } from "@/recordscratch/components/ui/Button";
import { useEffect } from "react";

const Error = ({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) => {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<main className="mt-[20vh] flex flex-col items-center justify-center gap-8">
			<h1>Something went wrong!</h1>
			<p className="text-muted-foreground">
				There has been an error processing your request
			</p>
			<Button onClick={() => reset()}>Try again</Button>
		</main>
	);
};

export default Error;
