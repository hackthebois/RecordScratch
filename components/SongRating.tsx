"use client";

import { trpc } from "@/app/_trpc/react";
import { Rating } from "@/drizzle/db/schema";
import { Resource } from "@/types/ratings";
import { cn } from "@/utils/utils";
import { Star } from "lucide-react";

const SongRating = ({
	resource,
	initialRating,
}: {
	resource: Resource;
	initialRating?: Rating;
}) => {
	const { data: rating } = trpc.rating.getAverage.useQuery(resource, {
		initialData: initialRating,
		staleTime: Infinity,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});

	return (
		<span
			className={cn(
				"flex items-center justify-center gap-2",
				!rating?.ratingAverage && "hidden"
			)}
		>
			<Star
				color="orange"
				fill={rating?.ratingAverage ? "orange" : "none"}
				size={18}
			/>
			<p className="text-sm font-medium sm:text-base">
				{rating ? Number(rating.ratingAverage).toFixed(1) : ""}
			</p>
		</span>
	);
};

export default SongRating;
