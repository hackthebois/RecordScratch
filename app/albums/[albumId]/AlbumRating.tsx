"use client";

import { trpc } from "@/app/_trpc/react";
import { Rating } from "@/components/rating/Rating";
import { RatingButton } from "@/components/rating/RatingButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Resource } from "@/types/ratings";
import { SignedIn, SignedOut } from "@clerk/nextjs";

type Props = {
	resource: Resource;
	name: string;
};

const UserRating = ({
	resource,
	name,
}: {
	resource: Resource;
	name: string;
}) => {
	const [userRating] = trpc.rating.getUserRating.useSuspenseQuery(resource);

	return (
		<RatingButton.SignedIn
			name={name}
			resource={resource}
			initialRating={userRating ?? null}
		/>
	);
};

const AlbumRating = ({ resource, name }: Props) => {
	const [rating] = trpc.rating.getAverage.useSuspenseQuery(resource);

	return (
		<div className="flex items-center gap-4">
			<Rating rating={rating} emptyText="Be first to rate!" />
			<SignedIn>
				<UserRating resource={resource} name={name} />
			</SignedIn>
			<SignedOut>
				<RatingButton.SignedOut />
			</SignedOut>
		</div>
	);
};

const AlbumRatingSkeleton = () => {
	return <Skeleton className="h-10 w-44" />;
};

export { AlbumRating, AlbumRatingSkeleton };
