"use client";

import { Star } from "lucide-react";
import { Button } from "../ui/Button";
import { Rate, useRatingDialog } from "./RatingDialog";

export const RatingButton = ({ resource, name, initialRating }: Rate) => {
	const { rate } = useRatingDialog();

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={() =>
				rate({
					resource,
					name,
					initialRating,
				})
			}
		>
			<Star
				color="orange"
				fill={initialRating ? "orange" : "none"}
				size={18}
				className="mr-2"
			/>
			{initialRating ? initialRating : "Rate"}
		</Button>
	);
};
