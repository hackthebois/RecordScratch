"use client";

import { isUserFollowing } from "@/recordscratch/app/_api";
import { followUser, unFollowUser } from "@/recordscratch/app/_api/actions";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/Button";
import { Skeleton } from "./ui/skeleton";

export const FollowButton = ({
	profileId,
	userId,
	initialIsFollowing,
}: {
	profileId: string;
	userId: string | null;
	initialIsFollowing?: boolean;
}) => {
	const {
		data: isFollowing,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["isUserFollowing", profileId, userId],
		queryFn: () => {
			return isUserFollowing(profileId, userId);
		},
		initialData: initialIsFollowing,
		enabled: !!userId,
		staleTime: 60 * 1000,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});

	if (!userId || userId === profileId) return null;

	if (isLoading) return <Skeleton className="h-10 w-20" />;

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
