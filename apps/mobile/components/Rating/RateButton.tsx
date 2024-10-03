import { Rating, Resource } from "@recordscratch/types";
import { Link } from "expo-router";
import React from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";
import { useAuth } from "~/lib/auth";
import { Star } from "~/lib/icons/Star";
import { Button } from "../ui/button";

const RateButton = ({
	initialUserRating,
	resource,
	imageUrl,
	name,
}: {
	initialUserRating?: Rating | null;
	resource: Resource;
	imageUrl?: string | null | undefined;
	name?: string;
}) => {
	const userId = useAuth((s) => s.profile!.userId);
	const { data: userRating, isLoading } = api.ratings.user.get.useQuery(
		{ resourceId: resource.resourceId, userId },
		{
			staleTime: Infinity,
			initialData: initialUserRating,
		}
	);

	if (isLoading) {
		return <Skeleton className="w-[80px] h-[48px]" />;
	}

	return (
		<Link
			href={{
				pathname: "(modals)/rating",
				params: {
					...resource,
					imageUrl,
					name,
				},
			}}
			asChild
		>
			<Button variant="secondary" className="flex-row gap-2">
				{!userRating ? (
					<>
						<Star size={25} className="mr-2" color="#fb8500" />
						<Text>Rate</Text>
					</>
				) : (
					<>
						<Star size={25} className="mr-2" color="#fb8500" fill="#fb8500" />
						<Text>{userRating.rating}</Text>
					</>
				)}
			</Button>
		</Link>
	);
};

export default RateButton;
