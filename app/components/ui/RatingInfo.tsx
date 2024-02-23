import { api } from "@/trpc/react";
import { Resource } from "@/types/rating";
import { cn } from "@/utils/utils";
import { Star } from "lucide-react";

export const RatingInfo = ({
	resource,
	size = "lg",
}: {
	resource: {
		resourceId: Resource["resourceId"];
		category: Resource["category"];
	};
	size?: "lg" | "sm";
}) => {
	const [rating] = api.ratings.get.useSuspenseQuery(resource);

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
