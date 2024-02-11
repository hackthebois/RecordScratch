"use client";

import { isUserFollowing } from "@/app/_api";
import { followUser, unFollowUser } from "@/app/_api/actions";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/Button";
import { Skeleton } from "./ui/skeleton";

export const FollowButton = ({
	profileId,
	initialIsFollowing,
}: {
	profileId: string;
	initialIsFollowing?: boolean;
}) => {
	const { userId, isLoaded } = useAuth();

	const {
		data: isFollowing,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["isUserFollowing", profileId, userId],
		queryFn: () => {
			return isUserFollowing(profileId, userId!);
		},
		initialData: initialIsFollowing,
		enabled: !!userId,
		staleTime: 60 * 1000,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});

	if (isLoading || !isLoaded) return <Skeleton className="h-10 w-20" />;

	if (!userId) return null;

	return (
		<>
			{isFollowing ? (
				<Button
					variant="secondary"
					onClick={(e) => {
						e.stopPropagation();
						e.preventDefault();
						unFollowUser(profileId);
						refetch();
					}}
				>
					Unfollow
				</Button>
			) : (
				<Button
					type="submit"
					onClick={(e) => {
						e.stopPropagation();
						e.preventDefault();
						followUser(profileId);
						refetch();
					}}
				>
					Follow
				</Button>
			)}
		</>
	);
};
