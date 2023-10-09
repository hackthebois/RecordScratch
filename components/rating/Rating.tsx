"use client";

import { Rating } from "@/drizzle/db/schema";
import { Star } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

type Props = {
	rating: Rating | null;
};

const Rating = ({ rating }: Props) => {
	return (
		<div className="flex items-center gap-4">
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
		</div>
	);
};

export const RatingSkeleton = () => {
	return (
		<div className="flex items-center gap-4">
			<Skeleton className="h-8 w-8" />
			<div className="flex flex-col">
				<Skeleton className="h-4 w-20" />
				<Skeleton className="mt-1 h-3 w-10" />
			</div>
		</div>
	);
};

export default Rating;
