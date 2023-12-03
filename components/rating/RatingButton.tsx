"use client";

import { useClerk } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Star } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/Button";

export const RatingButton = ({
	rating,
	onClick,
}: {
	rating?: number;
	onClick?: () => void;
}) => {
	return (
		<Button variant="outline" size="sm" onClick={onClick}>
			<Star
				color="#fb8500"
				fill={rating ? "#fb8500" : "none"}
				size={18}
				className="mr-2"
			/>
			{rating ? rating : "Rate"}
		</Button>
	);
};

RatingButton.SignedOut = () => {
	const { openSignIn } = useClerk();
	const clerkTheme = useTheme().theme === "dark" ? dark : undefined;

	return (
		<RatingButton
			onClick={() =>
				openSignIn({
					redirectUrl: undefined,
					appearance: { baseTheme: clerkTheme },
				})
			}
		/>
	);
};
