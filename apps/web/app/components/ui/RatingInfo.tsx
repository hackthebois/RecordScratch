import { api } from "@/trpc/react";
import { cn } from "@/utils/utils";
import { Resource, ResourceRating } from "@recordscratch/types";
import { Star } from "lucide-react";
import { Skeleton } from "./Skeleton";

export const RatingInfo = ({
	initialRating,
	resource,
	size = "lg",
}: {
	initialRating?: ResourceRating | null;
	resource: {
		resourceId: Resource["resourceId"];
		category: Resource["category"];
	};
	size?: "lg" | "sm";
}) => {
	const { data: rating, isLoading } = api.ratings.get.useQuery(resource, {
		initialData: initialRating,
		staleTime: Infinity,
	});

	if (isLoading) {
		return (
			<Skeleton
				className={cn(
					size === "lg" && "h-12 w-24",
					size === "sm" && "h-10 w-16"
				)}
			/>
		);
	}

	return (
		<div className="flex min-h-12 items-center gap-4">
			{!(size === "sm" && !rating?.average) && (
				<div className="flex items-center gap-2">
					<Star
						color="#ffb703"
						fill={rating?.average ? "#ffb703" : "none"}
						size={size === "lg" ? 26 : 18}
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
									: resource.category === "ARTIST"
										? "No ratings yet"
										: "Be first to rate"}
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
