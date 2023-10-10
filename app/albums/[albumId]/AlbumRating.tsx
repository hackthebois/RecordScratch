"use client";

import { trpc } from "@/app/_trpc/react";
import { Rating } from "@/components/rating/Rating";
import { RatingButton } from "@/components/rating/RatingButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Resource } from "@/types/ratings";
import { useAuth } from "@clerk/nextjs";

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
		<RatingButton
			name={name}
			resource={resource}
			initialRating={userRating?.rating ?? null}
		/>
	);
};

const AlbumRating = ({ resource, name }: Props) => {
	const { userId } = useAuth();
	const [rating] = trpc.rating.getAverage.useSuspenseQuery(resource);

	return (
		<div className="flex items-center gap-4">
			<Rating rating={rating} emptyText="Be first to rate!" />
			{userId ? (
				<UserRating resource={resource} name={name} />
			) : (
				<RatingButton
					name={name}
					resource={resource}
					initialRating={null}
				/>
			)}
		</div>
	);
};

const AlbumRatingSkeleton = () => {
	return <Skeleton className="h-10 w-44" />;
};

export { AlbumRating, AlbumRatingSkeleton };
