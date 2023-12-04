import { serverTrpc } from "@/app/_trpc/server";
import { Rating, Resource, ResourceRating } from "@/types/ratings";
import { cn } from "@/utils/utils";
import { SignedIn, SignedOut, auth } from "@clerk/nextjs";
import { Star } from "lucide-react";
import { unstable_cache } from "next/cache";
import { RatingDialog } from "./RatingDialog";
import { SignInWrapper } from "./SignInWrapper";
import { Button } from "./ui/Button";
import { Skeleton } from "./ui/skeleton";

export const Ratings = async ({
	resource,
	initial,
	type = "page",
}: {
	resource: Resource;
	initial?: {
		rating?: ResourceRating;
		userRating?: Rating;
	};
	type?: "page" | "list";
}) => {
	let rating: ResourceRating | null = initial?.rating ?? null;
	let userRating: Rating | null = initial?.userRating ?? null;

	if (!initial) {
		rating = await unstable_cache(
			async () => await serverTrpc.resource.rating.get(resource),
			[`resource:rating:get:${resource.resourceId}`],
			{ tags: [resource.resourceId] }
		)();

		const { userId } = auth();
		if (userId) {
			userRating = await unstable_cache(
				async () => await serverTrpc.user.rating.get(resource),
				[`user:rating:get:${resource.resourceId}`],
				{ tags: [resource.resourceId] }
			)();
		}
	}

	return (
		<div className="flex items-center gap-4">
			{!(type === "list" && !rating?.average) && (
				<div className="flex items-center gap-2">
					<Star
						color="#ffb703"
						fill={rating?.average ? "#ffb703" : "none"}
						size={type === "page" ? 30 : 18}
					/>
					<div>
						{rating?.average && (
							<p
								className={cn({
									"text-lg font-semibold": type === "page",
									"font-medium": type === "list",
								})}
							>
								{Number(rating.average).toFixed(1)}
							</p>
						)}
						{type === "page" && (
							<p className="text-sm text-muted-foreground">
								{rating?.total && Number(rating.total) !== 0
									? rating.total
									: "Be first to rate"}
							</p>
						)}
					</div>
				</div>
			)}
			<SignedIn>
				<RatingDialog
					resource={resource}
					initialRating={userRating ?? undefined}
				>
					<Button variant="outline" size="sm">
						<Star
							color="#fb8500"
							fill={userRating ? "#fb8500" : "none"}
							size={18}
							className="mr-2"
						/>
						{userRating?.rating ? userRating?.rating : "Rate"}
					</Button>
				</RatingDialog>
			</SignedIn>
			<SignedOut>
				<SignInWrapper>
					<Button variant="outline" size="sm">
						<Star
							color="#fb8500"
							fill="none"
							size={18}
							className="mr-2"
						/>
						Rate
					</Button>
				</SignInWrapper>
			</SignedOut>
		</div>
	);
};

export const RatingsSkeleton = () => {
	return <Skeleton className="h-10 w-40" />;
};
