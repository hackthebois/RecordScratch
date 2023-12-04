import { serverTrpc } from "@/app/_trpc/server";
import { Resource } from "@/types/ratings";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Star } from "lucide-react";
import { unstable_cache } from "next/cache";
import { Skeleton } from "../ui/skeleton";
import { RatingButton } from "./RatingButton";
import { RatingDialog } from "./RatingDialog";

const Ratings = async ({ resource }: { resource: Resource }) => {
	const rating = await unstable_cache(
		async () => await serverTrpc.resource.rating.get(resource),
		[`resource:rating:get:${resource.resourceId}`],
		{ tags: [resource.resourceId] }
	)();
	const userRating = await unstable_cache(
		async () => await serverTrpc.user.rating.get(resource),
		[`user:rating:get:${resource.resourceId}`],
		{ tags: [resource.resourceId] }
	)();

	return (
		<div className="flex gap-4">
			<div className="flex items-center gap-2">
				<Star
					color="#ffb703"
					fill={rating?.average ? "#ffb703" : "none"}
					size={30}
				/>
				<div>
					{rating?.average && (
						<p className="text-lg font-semibold">
							{Number(rating.average).toFixed(1)}
						</p>
					)}
					<p className="text-xs text-muted-foreground">
						{rating?.total && Number(rating.total) !== 0
							? rating.total
							: "Be the first to rate"}
					</p>
				</div>
			</div>
			<SignedIn>
				<RatingDialog resource={resource} initialRating={userRating}>
					<RatingButton rating={userRating?.rating} />
				</RatingDialog>
			</SignedIn>
			<SignedOut>
				<RatingButton.SignedOut />
			</SignedOut>
		</div>
	);
};

export const RatingsSkeleton = () => {
	return <Skeleton className="h-10 w-20" />;
};

export default Ratings;
