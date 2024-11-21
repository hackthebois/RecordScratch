import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { Star } from "@/lib/icons/Star";
import { cn } from "@recordscratch/lib";
import { Resource, ResourceRating } from "@recordscratch/types";
import { Link } from "expo-router";
import { Pressable, View } from "react-native";
import { Skeleton } from "../ui/skeleton";

export const RatingInfo = ({
	initialRating,
	resource,
	size = "lg",
}: {
	initialRating?: ResourceRating | null;
	resource: Resource;
	size?: "lg" | "sm";
}) => {
	const { data: rating, isLoading } = api.ratings.get.useQuery(resource, {
		initialData: initialRating,
		staleTime: Infinity,
	});

	if (isLoading)
		return (
			<View
				className={cn(
					"flex min-h-12 gap-4 justify-center",
					size === "sm" && "h-8 min-w-18",
					size === "lg" && "h-12 min-w-20"
				)}
			>
				<View className="flex items-center justify-center flex-row gap-2">
					<Star size={size === "lg" ? 32 : 21} color="#ffb703" />
					<View className="flex flex-col gap-1">
						<Skeleton className="w-6">
							<Text
								className={cn({
									"text-lg font-semibold": size === "lg",
									"font-semibold text": size === "sm",
								})}
							/>
						</Skeleton>
						{size === "lg" && (
							<Skeleton className="w-4">
								<Text className="text-lg text-muted-foreground" />
							</Skeleton>
						)}
					</View>
				</View>
			</View>
		);

	const href =
		resource.category === "ALBUM"
			? `/albums/${resource.resourceId}/reviews`
			: resource.category === "SONG"
				? `/albums/${resource.parentId}/songs/${resource.resourceId}/reviews`
				: "";

	return (
		<Link href={href as any} asChild>
			<Pressable
				className={cn(
					"flex min-h-12 gap-4 justify-center",
					size === "sm" && "h-8 min-w-18",
					size === "lg" && "h-12 min-w-20"
				)}
			>
				{!(size === "sm" && !rating?.average) && (
					<View className="flex items-center justify-center flex-row gap-2">
						<Star size={size === "lg" ? 32 : 21} color="#ffb703" fill="#ffb703" />
						<View className="flex flex-col">
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
			</Pressable>
		</Link>
	);
};
