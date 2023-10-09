"use client";

import { Rating as RatingType } from "@/drizzle/db/schema";
import { Star } from "lucide-react";

type Props = {
	rating: RatingType | null;
	emptyText: string;
};

const Rating = ({ rating, emptyText }: Props) => {
	return (
		<div className="flex items-center gap-2">
			<Star
				color="orange"
				fill={rating?.ratingAverage ? "orange" : "none"}
				size={30}
			/>
			<div>
				{rating?.ratingAverage && (
					<p className="text-lg font-semibold">
						{rating?.ratingAverage}
					</p>
				)}
				<p className="text-xs text-muted-foreground">
					{rating?.totalRatings && Number(rating?.totalRatings) !== 0
						? rating?.totalRatings
						: emptyText}
				</p>
			</div>
		</div>
	);
};

export { Rating };
