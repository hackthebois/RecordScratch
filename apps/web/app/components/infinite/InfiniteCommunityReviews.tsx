import { api } from "@/trpc/react";
import { Resource } from "@recordscratch/types";
import { Disc3 } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Review } from "../review/Review";
import { ReviewDialog } from "../review/ReviewDialog";
import { SignInReviewButton } from "../signIn/SignInReviewButton";

export const InfiniteCommunityReviews = ({
	pageLimit,
	resource,
	name,
}: {
	pageLimit: number;
	resource: Resource;
	name: string;
}) => {
	const { ref, inView } = useInView();
	const { data: profile } = api.profiles.me.useQuery();

	const { data, fetchNextPage, hasNextPage } =
		api.ratings.feed.community.useInfiniteQuery(
			{
				limit: pageLimit,
				resource,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			}
		);

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [inView, fetchNextPage]);

	return (
		<div className="flex w-full flex-col gap-4">
			<div className="flex w-full gap-2">
				{profile ? (
					<ReviewDialog
						userId={profile.userId}
						resource={resource}
						name={name}
					/>
				) : (
					<SignInReviewButton />
				)}
			</div>
			<div className="flex flex-col gap-3">
				{data?.pages.map((page, index) => (
					<div key={index} className="flex flex-col gap-3">
						{page.items.map((review, index) => (
							<Review key={index} {...review} />
						))}
					</div>
				))}
			</div>
			{!data && <div className="h-screen" />}
			{hasNextPage && (
				<div
					ref={ref}
					className="flex h-40 flex-1 flex-col items-center justify-center"
				>
					<Disc3 size={35} className="animate-spin" />
				</div>
			)}
		</div>
	);
};
