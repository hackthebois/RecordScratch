import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/trpc/react";
import { useAuth } from "@clerk/clerk-react";

export const FollowButton = ({ profileId }: { profileId: string }) => {
	const utils = api.useUtils();
	const { userId } = useAuth();
	const {
		data: isFollowing,
		isLoading,
		refetch,
	} = api.profiles.isFollowing.useQuery(profileId, {
		enabled: !!userId,
	});

	const revalidate = () => {
		utils.profiles.isFollowing.invalidate(profileId);

		// Invalidate profiles followers
		utils.profiles.followCount.invalidate({ profileId: profileId, type: "followers" });
		utils.profiles.followProfiles.invalidate({ profileId, type: "followers" });

		// Invalidate user following
		utils.profiles.followCount.invalidate({ profileId: userId!, type: "following" });
		utils.profiles.followProfiles.invalidate({ profileId: userId!, type: "following" });
	};

	const followUser = api.profiles.follow.useMutation({
		onSettled: () => {
			revalidate();
		},
	});
	const unFollowUser = api.profiles.unFollow.useMutation({
		onSettled: () => {
			revalidate();
		},
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
