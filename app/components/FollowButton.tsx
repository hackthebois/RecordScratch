import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/trpc/react";
import { useAuth } from "@clerk/clerk-react";

export const FollowButton = ({ profileId }: { profileId: string }) => {
	const { userId } = useAuth();
	const {
		data: isFollowing,
		isLoading,
		refetch,
	} = api.profiles.isFollowing.useQuery(profileId, {
		enabled: !!userId,
	});

	const followUser = api.profiles.follow.useMutation();
	const unFollowUser = api.profiles.unFollow.useMutation();

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
						unFollowUser.mutate(profileId);
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
						followUser.mutate(profileId);
						refetch();
					}}
				>
					Follow
				</Button>
			)}
		</>
	);
};
