"use client";

import { Rating as RatingType } from "@/drizzle/db/schema";
import { Star } from "lucide-react";

type Props = {
	rating: RatingType | null;
};

const Rating = ({ rating }: Props) => {
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
					{rating?.totalRatings ?? "Be first to rate!"}
				</p>
			</div>
		</div>
	);
};

export { Rating };
