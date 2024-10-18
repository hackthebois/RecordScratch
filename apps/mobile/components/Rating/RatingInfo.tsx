import { cn } from "@recordscratch/lib";
import { Resource, ResourceRating } from "@recordscratch/types";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";
import { Star } from "~/lib/icons/Star";

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

	if (isLoading) return <Star size={32} color="#ffb703" />;

	return (
		<View className="flex min-h-12 gap-4 justify-center">
			{!(size === "sm" && !rating?.average) && (
				<View className="flex items-center justify-center flex-row gap-2">
					<Star size={size === "lg" ? 32 : 21} color="#ffb703" fill="#ffb703" />
					<View className="flex flex-col items-center">
						{rating?.average && (
							<Text
								className={cn({
									"text-lg font-semibold": size === "lg",
									"font-semibold text": size === "sm",
								})}
							>
								{Number(rating.average).toFixed(1)}
							</Text>
						)}
						{size === "lg" && (
							<Text className="text-lg text-muted-foreground">
								{rating?.total && Number(rating.total) !== 0
									? rating.total
									: resource.category === "ARTIST"
										? "No ratings yet"
										: "Be first to rate"}
							</Text>
						)}
					</View>
				</View>
			)}
		</View>
	);
};
