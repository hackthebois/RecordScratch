"use client";

import { getRating, getUserRating } from "@/app/_api";
import RateButton from "@/app/_auth/RateButton";
import { Resource } from "@/types/rating";
import { useAuth } from "@clerk/nextjs";
import { useSuspenseQuery } from "@tanstack/react-query";
import { RatingInfo } from "./ui/RatingInfo";

export const Ratings = ({ resource }: { resource: Resource }) => {
	const { userId } = useAuth();
	const { data: rating } = useSuspenseQuery({
		queryKey: ["rating", resource],
		queryFn: () => getRating(resource),
	});

	const { data: userRating } = useSuspenseQuery({
		queryKey: ["userRating", resource, userId],
		queryFn: () => {
			if (userId) {
				return getUserRating(resource, userId);
			} else {
				return null;
			}
		},
	});

	return (
		<div className="flex items-center gap-4">
			<RatingInfo rating={rating} />
			<RateButton resource={resource} userRating={userRating} />
		</div>
	);
};
