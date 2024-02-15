"use client";

import { ResourceRating } from "@/recordscratch/types/rating";
import { cn } from "@/recordscratch/utils/utils";
import { Star } from "lucide-react";

export const RatingInfo = ({
	rating,
	size = "lg",
}: {
	rating: ResourceRating;
	size?: "lg" | "sm";
}) => {
	return (
		<div className="flex items-center gap-4">
			{!(size === "sm" && !rating?.average) && (
				<div className="flex items-center gap-2">
					<Star
						color="#ffb703"
						fill={rating?.average ? "#ffb703" : "none"}
						size={size === "lg" ? 30 : 18}
					/>
					<div>
						{rating?.average && (
							<p
								className={cn({
									"text-lg font-semibold": size === "lg",
									"font-medium": size === "sm",
								})}
							>
								{Number(rating.average).toFixed(1)}
							</p>
						)}
						{size === "lg" && (
							<p className="text-sm text-muted-foreground">
								{rating?.total && Number(rating.total) !== 0
									? rating.total
									: "Be first to rate"}
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
