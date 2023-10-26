"use client";

import { useClerk } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Star } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/Button";
import { Rate, useRatingDialog } from "./RatingDialog";

export const RatingButton = ({
	rating,
	onClick,
}: {
	rating: number | null;
	onClick: () => void;
}) => {
	return (
		<Button variant="outline" size="sm" onClick={onClick}>
			<Star
				color="orange"
				fill={rating ? "orange" : "none"}
				size={18}
				className="mr-2"
			/>
			{rating ? rating : "Rate"}
		</Button>
	);
};

RatingButton.SignedIn = ({ resource, name, initialRating }: Rate) => {
	const { rate } = useRatingDialog();

	return (
		<RatingButton
			rating={initialRating?.rating ?? null}
			onClick={() => rate({ resource, name, initialRating })}
		/>
	);
};

RatingButton.SignedOut = () => {
	const { openSignIn } = useClerk();
	const clerkTheme = useTheme().theme === "dark" ? dark : undefined;

	return (
		<RatingButton
			rating={null}
			onClick={() =>
				openSignIn({
					redirectUrl: undefined,
					appearance: { baseTheme: clerkTheme },
				})
			}
		/>
	);
};
