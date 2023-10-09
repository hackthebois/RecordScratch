"use client";

import { trpc } from "@/app/_trpc/react";
import Rating from "@/components/rating/Rating";
import { RatingButton } from "@/components/rating/RatingButton";
import { Resource } from "@/types/ratings";

type Props = {
	resource: Resource;
	name: string;
};

const AlbumRating = ({ resource, name }: Props) => {
	const [rating] = trpc.rating.getAverage.useSuspenseQuery(resource);
	const [userRating] = trpc.rating.getUserRating.useSuspenseQuery(resource);

	return (
		<div className="flex items-center gap-4">
			<Rating rating={rating} />
			<RatingButton
				name={name}
				resource={resource}
				initialRating={userRating?.rating ?? null}
			/>
		</div>
	);
};

export default AlbumRating;
