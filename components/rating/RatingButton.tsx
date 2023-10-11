"use client";

import { useClerk } from "@clerk/nextjs";
import { Star } from "lucide-react";
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
			rating={initialRating}
			onClick={() => rate({ resource, name, initialRating })}
		/>
	);
};

RatingButton.SignedOut = () => {
	const { openSignIn } = useClerk();

	return (
		<RatingButton
			rating={null}
			onClick={() => openSignIn({ redirectUrl: undefined })}
		/>
	);
};
