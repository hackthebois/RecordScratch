"use client";

import { RatingDialog, RatingProvider } from "@/components/ratings";
import { Ratings, Resource } from "@/types/ratings";
import { Star } from "lucide-react";

type Props = {
	resource: Resource;
	ratings: Ratings;
};

const AlbumRating = ({ ratings, resource }: Props) => {
	return (
		<RatingProvider resource={resource} initialRatings={ratings}>
			{({ rating, userRating, onChange }) => {
				return (
					<>
						<Star
							color="orange"
							fill={rating?.ratingAverage ? "orange" : "none"}
							size={30}
						/>
						<div>
							<p className="text-lg font-semibold">
								{rating?.ratingAverage
									? `${rating?.ratingAverage}`
									: "No ratings"}
							</p>
							<p className="text-xs text-muted-foreground">
								{rating?.totalRatings ?? "0"}
							</p>
						</div>
						<RatingDialog.Button
							userRating={userRating}
							onChange={onChange}
						/>
					</>
				);
			}}
		</RatingProvider>
	);
};

export default AlbumRating;
